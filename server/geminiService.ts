import { GoogleGenAI } from '@google/genai';

/**
 * Valid candidate models from the @google/genai ecosystem.
 * Models are tried in priority order:
 * 1. Configured GEMINI_MODEL (or 'gemini-2.5-flash' default)
 * 2. 'gemini-flash-latest'
 * 3. 'gemini-3.8-flash'
 * 4. 'gemini-3.1-flash-lite'
 */
const DEFAULT_MODEL = 'gemini-3.6-flash';
const VALID_FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

interface ModelHealth {
  consecutiveFailures: number;
  cooldownUntil: number;
  lastFailureReason?: string;
}

// Circuit breaker state per model name
const modelHealthMap = new Map<string, ModelHealth>();

const CIRCUIT_BREAKER_MAX_FAILURES = 3;
const CIRCUIT_BREAKER_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

function getModelHealth(modelName: string): ModelHealth {
  let health = modelHealthMap.get(modelName);
  if (!health) {
    health = { consecutiveFailures: 0, cooldownUntil: 0 };
    modelHealthMap.set(modelName, health);
  }
  return health;
}

function isModelAvailable(modelName: string): boolean {
  const health = getModelHealth(modelName);
  if (health.cooldownUntil > 0) {
    if (Date.now() < health.cooldownUntil) {
      return false; // Still in cooldown
    }
    // Cooldown expired, allow retry
    health.cooldownUntil = 0;
  }
  return true;
}

function recordModelSuccess(modelName: string): void {
  const health = getModelHealth(modelName);
  health.consecutiveFailures = 0;
  health.cooldownUntil = 0;
  health.lastFailureReason = undefined;
}

function recordModelFailure(modelName: string, reason: string): void {
  const health = getModelHealth(modelName);
  health.consecutiveFailures += 1;
  health.lastFailureReason = reason;

  if (health.consecutiveFailures >= CIRCUIT_BREAKER_MAX_FAILURES) {
    health.cooldownUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
    console.warn(
      `[OREA Gemini CircuitBreaker] Modèle ${modelName} placé en cooldown pour ${CIRCUIT_BREAKER_COOLDOWN_MS / 1000}s après ${health.consecutiveFailures} échecs consécutifs: ${reason}`
    );
  }
}

// Singleton GoogleGenAI Client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Returns prioritized list of candidate models, filtered by Circuit Breaker cooldown.
 */
export function getAvailableModelsList(requestedModel?: string): string[] {
  const primaryModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const list: string[] = [];

  if (requestedModel && VALID_FALLBACK_MODELS.includes(requestedModel)) {
    list.push(requestedModel);
  }
  if (!list.includes(primaryModel)) {
    list.push(primaryModel);
  }
  for (const m of VALID_FALLBACK_MODELS) {
    if (!list.includes(m)) {
      list.push(m);
    }
  }

  // Filter out models currently in cooldown, but keep at least 1 model if all are in cooldown
  const available = list.filter((m) => isModelAvailable(m));
  return available.length > 0 ? available : list.slice(0, 2);
}

/**
 * Check if an error is transient / retryable (503 Unavailable, 429 Rate limit, timeout, socket hang up).
 */
export function isRetryableError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const status = err.status || err.statusCode || err.code;

  if (status === 503 || status === 429 || status === 500 || status === 'UNAVAILABLE' || status === 'RESOURCE_EXHAUSTED') {
    return true;
  }
  if (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('rate limit') ||
    msg.includes('resource_exhausted') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout') ||
    msg.includes('socket hang up') ||
    msg.includes('network')
  ) {
    return true;
  }
  return false;
}

/**
 * Wait helper with exponential backoff and jitter.
 * Sequence: 1s -> 2s -> 4s (+ jitter 0-500ms)
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitWithBackoff(attempt: number, err?: any): Promise<void> {
  let delayMs = 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
  const errMsg = String(err?.message || '');
  const match = errMsg.match(/retry in ([0-9.]+)s/i);
  if (match) {
    const sec = parseFloat(match[1]);
    if (!isNaN(sec) && sec > 0) {
      delayMs = Math.max(delayMs, Math.ceil(sec * 1000) + 500);
    }
  }
  delayMs = Math.min(delayMs, 10000);
  console.log(`[OREA Gemini Retry] Attente de ${delayMs}ms avant nouvelle tentative (tentative ${attempt + 1})...`);
  await sleep(delayMs);
}

export interface GenerateOreaOptions {
  userPrompt: string;
  systemInstruction: string;
  requestedModel?: string;
  maxRetriesPerModel?: number;
}

/**
 * Centralized Non-Streaming Gemini Generation with Backoff, Jitter, and Circuit Breaker.
 */
export async function generateContentWithResilience(options: GenerateOreaOptions): Promise<{
  text: string;
  model: string;
}> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY non configurée sur le serveur.');
  }

  const modelsToTry = getAvailableModelsList(options.requestedModel);
  const maxRetries = options.maxRetriesPerModel ?? 3;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`[OREA Gemini] Appel ${modelName} (tentative ${attempt + 1}/${maxRetries})...`);
        const response: any = await client.models.generateContent({
          model: modelName,
          contents: options.userPrompt,
          config: {
            systemInstruction: options.systemInstruction,
          },
        });

        if (response && response.text) {
          recordModelSuccess(modelName);
          return {
            text: response.text,
            model: modelName,
          };
        }
        throw new Error(`Réponse vide reçue du modèle ${modelName}`);
      } catch (err: any) {
        lastError = err;
        const retryable = isRetryableError(err);
        console.warn(`[OREA Gemini] Échec ${modelName} (tentative ${attempt + 1}): ${err?.message || err}`);

        if (retryable && attempt < maxRetries - 1) {
          await waitWithBackoff(attempt, err);
          attempt++;
        } else {
          // Model failed after retries or error is fatal
          recordModelFailure(modelName, err?.message || 'Erreur inconnue');
          break;
        }
      }
    }
  }

  throw lastError || new Error('OREA n’a pas pu générer cette réponse pour le moment.');
}

/**
 * Centralized Streaming Gemini Generation with Backoff, Jitter, and Circuit Breaker.
 */
export async function* streamContentWithResilience(options: GenerateOreaOptions): AsyncGenerator<{
  chunkText: string;
  model: string;
}> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY non configurée sur le serveur.');
  }

  const modelsToTry = getAvailableModelsList(options.requestedModel);
  const maxRetries = options.maxRetriesPerModel ?? 3;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`[OREA Gemini Stream] Démarrage stream ${modelName} (tentative ${attempt + 1}/${maxRetries})...`);
        const stream = await client.models.generateContentStream({
          model: modelName,
          contents: options.userPrompt,
          config: {
            systemInstruction: options.systemInstruction,
          },
        });

        let receivedAnyChunk = false;
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            receivedAnyChunk = true;
            yield { chunkText, model: modelName };
          }
        }

        if (receivedAnyChunk) {
          recordModelSuccess(modelName);
          return;
        }
        throw new Error(`Aucun chunk de texte reçu pour ${modelName}`);
      } catch (err: any) {
        lastError = err;
        const retryable = isRetryableError(err);
        console.warn(`[OREA Gemini Stream] Échec stream ${modelName} (tentative ${attempt + 1}): ${err?.message || err}`);

        if (retryable && attempt < maxRetries - 1) {
          await waitWithBackoff(attempt, err);
          attempt++;
        } else {
          recordModelFailure(modelName, err?.message || 'Stream interrompu');
          break; // Go to next fallback model
        }
      }
    }
  }

  throw lastError || new Error('OREA n’a pas pu générer cette réponse pour le moment.');
}
