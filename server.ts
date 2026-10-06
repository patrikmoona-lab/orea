import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getPaymentProvider, PaymentProviderId } from './server/paymentProviders/index';
import {
  generateContentWithResilience,
  streamContentWithResilience,
  getGeminiClient,
} from './server/geminiService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Load Firebase configuration
let firebaseConfig: any = {
  projectId: 'orea-d69a1',
};
try {
  const cfgPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(cfgPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  }
} catch (e) {
  console.warn('[OREA Server] firebase-applet-config.json introuvable:', e);
}

// In-memory cache for user preferences & fallback state
const localDatabase: {
  userProfiles: Record<string, any>;
  cycleData: Record<string, any[]>;
  plannerItems: Record<string, any[]>;
  workoutLogs: Record<string, any[]>;
  payments: Record<string, any>;
  familyProfiles: Record<string, any[]>;
  businessOrgs: Record<string, any>;
  bacG2Progress: Record<string, any[]>;
} = {
  userProfiles: {},
  cycleData: {},
  plannerItems: {},
  workoutLogs: {},
  payments: {},
  familyProfiles: {},
  businessOrgs: {},
  bacG2Progress: {},
};

// Plan & Feature hierarchy for backend access control
const PLAN_TIER_LEVELS: Record<string, number> = {
  free: 0,
  essentiel: 1,
  plus: 2,
  premium: 3,
  pro: 4,
  business: 5,
};

const FEATURE_TIER_REQUIREMENTS: Record<string, number> = {
  // Free (Tier 0)
  medical_encyclopedia: 0,
  health_cards_no_ads: 0,
  basic_habits_limit: 0,
  hydration_calculator: 0,
  emergency_numbers: 0,
  // Essentiel (Tier 1)
  symptom_checker: 1,
  medical_agenda: 1,
  consultation_reminders: 1,
  medicine_cabinet: 1,
  dosage_management: 1,
  female_cycle: 1,
  pdf_health_export: 1,
  // Plus (Tier 2)
  dynamic_planner: 2,
  planner: 2,
  workout_programs: 2,
  terroir_nutrition: 2,
  unlimited_habits: 2,
  budget_manager: 2,
  assistant_standard: 2,
  // Premium (Tier 3)
  ai_unlimited: 3,
  bac_g2_module: 3,
  bac_g2: 3,
  savings_goals: 3,
  personalized_alerts: 3,
  whatsapp_priority_support: 3,
  // Pro (Tier 4)
  family_profiles: 4,
  eloquence_module: 4,
  forecast_finance: 4,
  cloud_archive_secure: 4,
  quarterly_reviews: 4,
  direct_team_line: 4,
  // Business (Tier 5)
  business_organization: 5,
  bulk_billing: 5,
  admin_dashboard_org: 5,
  dedicated_support: 5,
};

function serverHasFeature(user: any, feature: string): boolean {
  if (!user) {
    return (FEATURE_TIER_REQUIREMENTS[feature] ?? 99) === 0;
  }
  if (user.role === 'admin' || user.email?.toLowerCase() === 'patrik.moona@gmail.com') {
    return true;
  }
  const planId = user.plan || user.subscription?.planId || 'free';
  const status = user.subscription_status || user.subscription?.status;
  const expiresAt = user.subscription_end || user.subscription?.expiresAt;

  if (planId !== 'free' && expiresAt) {
    const exp = new Date(expiresAt).getTime();
    if (!isNaN(exp) && exp < Date.now()) {
      return (FEATURE_TIER_REQUIREMENTS[feature] ?? 99) === 0;
    }
  }

  const userTier = (status === 'active' || planId === 'free') ? (PLAN_TIER_LEVELS[planId] ?? 0) : 0;
  const reqTier = FEATURE_TIER_REQUIREMENTS[feature] ?? 0;
  return userTier >= reqTier;
}

function calculateUserFeaturesMap(planId: string): Record<string, boolean> {
  const tier = PLAN_TIER_LEVELS[planId] ?? 0;
  const map: Record<string, boolean> = {};
  for (const [feat, reqTier] of Object.entries(FEATURE_TIER_REQUIREMENTS)) {
    map[feat] = tier >= reqTier;
  }
  return map;
}

// Helper: Authenticate user from Firebase token
async function authenticateFirebaseUser(req: express.Request): Promise<{
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  isAnonymous?: boolean;
}> {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (token) {
    // 1. Attempt to decode standard Firebase JWT payload safely
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        if (payload && (payload.sub || payload.user_id)) {
          const uid = payload.sub || payload.user_id;
          const isAnon = payload.firebase?.sign_in_provider === 'anonymous';
          return {
            uid,
            email: payload.email,
            name: payload.name || (isAnon ? 'Utilisateur OREA' : 'Membre OREA'),
            picture: payload.picture,
            isAnonymous: isAnon,
          };
        }
      }
    } catch (jwtErr) {
      console.warn('[Server Auth] Error parsing JWT token:', jwtErr);
    }

    // 2. Check with Google tokeninfo endpoint
    try {
      const tokenInfoResp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (tokenInfoResp.ok) {
        const data: any = await tokenInfoResp.json();
        if (data && data.sub) {
          return {
            uid: data.sub,
            email: data.email,
            name: data.name,
            picture: data.picture,
            isAnonymous: false,
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  // Graceful session: allow guest interaction with Gemini rather than rejecting with 401
  const fallbackUid = req.ip ? `guest_${Buffer.from(req.ip).toString('hex').slice(0, 8)}` : 'guest_user';
  return {
    uid: fallbackUid,
    name: 'Utilisateur OREA',
    isAnonymous: true,
  };
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const activeModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  res.json({
    status: 'ok',
    app: 'OREA',
    brain: 'Gemini',
    model: activeModel,
    geminiConfigured: hasGeminiKey,
    firebaseProject: 'orea-d69a1',
    timestamp: new Date().toISOString(),
  });
});

// 2. Deterministic Triage Engine API
const EMERGENCY_KEYWORDS = [
  'douleur thoracique', 'infarctus', 'crise cardiaque', 'inconscient', 'perte de connaissance',
  'saignement abondant', 'hemorragie', 'hémorragie', 'etouffement', 'détresse respiratoire',
  'avc', 'paralysie', 'convulsion', 'coma', 'asphyxie', 'empoisonnement', 'brulure grave', 'brûlure grave'
];

app.post('/api/triage/check', (req, res) => {
  const { symptoms, duration, intensity, age, context } = req.body || {};
  const query = `${symptoms || ''} ${context || ''}`.toLowerCase();

  let emergencyDetected = false;
  let matchedTerm = '';

  for (const keyword of EMERGENCY_KEYWORDS) {
    if (query.includes(keyword)) {
      emergencyDetected = true;
      matchedTerm = keyword;
      break;
    }
  }

  if (emergencyDetected) {
    return res.json({
      level: 'URGENCE_VITALE',
      isEmergency: true,
      matchedTerm,
      message: 'Signe d\'alerte majeur détecté. Veuillez contacter immédiatement les urgences (SAMU ou pompiers) ou vous rendre au centre hospitalier le plus proche.',
      contacts: [
        { name: 'SAMU Congo', phone: '112' },
        { name: 'Pompiers Congo', phone: '118' },
        { name: 'Police Secours', phone: '117' },
        { name: 'Urgences CHU Brazzaville', phone: '+242 06 669 35 35' },
        { name: 'Urgences Hôpital Militaire BZV', phone: '+242 05 521 14 00' },
      ],
    });
  }

  const isModerate = intensity === 'importante' || query.includes('fievre elevee') || query.includes('fièvre élevée');
  if (isModerate) {
    return res.json({
      level: 'CONSULTATION_RAPIDE',
      isEmergency: false,
      message: 'Ces symptômes nécessitent une consultation médicale sous 24 à 48 heures auprès d\'un médecin.',
      contacts: [
        { name: 'Centre de Santé OREA', phone: '+242 06 400 12 34' },
      ],
    });
  }

  res.json({
    level: 'NORMAL_INFORMATION',
    isEmergency: false,
    message: 'Informations éducatives et hygiène de vie. Consultez un soignant si les symptômes persistent ou s\'aggravent.',
  });
});

// OREA System Prompt Generator
function buildOreaSystemPrompt(): string {
  const activeModelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return `Tu es l'assistant central d'OREA, propulsé par Gemini (${activeModelName}) pour une expérience d'intelligence holistique réelle.
Devise officielle d'OREA : « Mieux comprendre. Mieux vivre. Mieux évoluer. »

IDENTITÉ & POSTURE :
- Rôle : Compagnon d'intelligence holistique personnel, chaleureux, clair, rigoureux et bienveillant.
- Modèle de génération : Gemini.
- Langue : Français soigné, fluide et naturel.

CRÉATEUR & FONDATEUR OFFICIEL D'OREA :
- Le créateur et fondateur officiel d'OREA est Mr Tsoumou Patrick Bonheur.
- Si l'utilisateur demande « Qui a créé OREA ? », « Qui est le fondateur d'OREA ? », « Qui est derrière OREA ? », « À qui appartient OREA ? » ou toute question sur l'origine d'OREA, réponds immédiatement et clairement :
  « OREA a été créé et fondé par Mr Tsoumou Patrick Bonheur. »
- Tu peux expliquer que Mr Tsoumou Patrick Bonheur est l'initiateur de la vision et du concept d'OREA, une plateforme conçue pour accompagner chacun dans sa santé, son bien-être, son évolution personnelle, son apprentissage et son organisation.
- Ne cite ni n'invente jamais aucun autre nom de créateur, fondateur ou propriétaire.

RÈGLES STRICTES DE STYLE & D'EFFICACITÉ :
1. ADAPTATION À LA DEMANDE (PAS DE GÉNÉRALITÉS) :
   - Question simple ou salutation -> Réponse courte, claire et conviviale.
   - Question complexe ou pédagogique -> Réponse structurée avec sous-titres courts en gras et puces aérées.
   - Demande d'exercice ou d'exemple -> Fournis directement un exemple concret ou un exercice avec sa correction étape par étape.
   - Demande de programme -> Propose un planning ou un programme clair immédiatement actionnable.

2. SUPPRESSION DES ÉLÉMENTS INUTILES :
   - NE JAMAIS ajouter automatiquement de bibliographies, de liens hypertextes, de sources universitaires ou de listes de références inutiles.
   - Si et seulement si l'utilisateur demande expressément : « Donne-moi les sources », alors seulement fournis les sources vérifiées.

3. ÉDUCATION & RÉVISIONS BAC G2 (TECHNIQUES QUANTITATIVES DE GESTION) :
   - Référentiel SYSCOHADA révisé strict :
     * Classe 1 : Comptes de ressources durables (capitaux propres, dettes financières)
     * Classe 2 : Comptes d'actif immobilisé
     * Classe 3 : Comptes de stocks
     * Classe 4 : Comptes de tiers (fournisseurs, clients, personnel, État)
     * Classe 5 : Comptes de trésorerie (banque, caisse)
     * Classe 6 : Charges des activités ordinaires
     * Classe 7 : Produits des activités ordinaires
     * Classe 8 : Comptes des opérations Hors Activités Ordinaires (HAO)
   - Explique les mécanismes (amortissements, bilan, compte de résultat, écritures comptables débit/crédit) avec pédagogie concrète.

4. SANTÉ & PRÉVENTION MÉDICALE :
   - RÈGLE ABSOLUE : Tu n'es pas un médecin. Ne pose JAMAIS de diagnostic médical formel. Ne prescris JAMAIS de médicament ni de posologie.
   - Donne des conseils d'hygiène de vie et de prévention, et invite toujours à consulter un médecin ou un centre de santé de proximité.
   - En cas d'urgence vitale, rappelle immédiatement les secours : SAMU (112), Pompiers (118), CHU de Brazzaville ou Hôpital de Loandjili.

5. MON CYCLE & SANTÉ FÉMININE :
   - Les calculs de dates d'ovulation ou de règles sont effectués de manière mathématique dans OREA.
   - Ton rôle est d'expliquer les phases physiologiques (menstruelle, folliculaire, ovulatoire, lutéale) et de conseiller le bien-être.
   - Rappelle toujours que les prévisions de cycle sont des estimations indicatives et NE DOIVENT JAMAIS servir de moyen de contraception.

6. NUTRITION LOCALE :
   - Valorise l'Assiette OREA 50/25/25 et les produits locaux : safou, saka-saka / feuilles de manioc, patate douce, manioc, moringa, fruits de saison, bissap sans excès de sucre.

7. FINANCES & BUDGET :
   - Exprime les montants en Francs CFA (FCFA) avec la règle budgétaire 50/30/20.

8. OREA ÉNERGIE (ENTRAÎNEMENT & VITALITÉ AU POIDS DU CORPS) :
   - Les 10 zones officielles d'OREA sont : Bras, Jambes, Avant-bras, Dos, Abdos, Épaules, Fessiers, Mollets, Poitrine, Corps complet.
   - Les 7 niveaux officiels sont : Faible, Débutant, Intermédiaire, Normal, Intensif, Extrême, Spartiate.
   - Bibliothèque réelle d'exercices OREA : Pompes classiques, Pompes murales, Squats profonds, Fentes avant, Gainage ventral (Planche), Crunchs contrôlés, Dips triceps sur chaise, Superman lombaire, Pike push-ups, Pont fessier, Élévations des mollets, Squeeze avant-bras, Mountain climbers, Jumping Jacks, Burpees spartiates.
   - Si l'utilisateur demande par exemple : « Je suis débutant et je veux travailler mes jambes pendant 15 minutes », réponds en utilisant les exercices réels de la bibliothèque (ex: Squats profonds, Fentes avant) avec instructions posturales et invite-le à lancer sa séance personnalisée dans l'Espace ÉNERGIE.

9. CONCLUSION :
   - Conclus brièvement sans lourdeur, en proposant si pertinent une action d'accompagnement.`;
}

// Helper: Action router suggestion
function detectSuggestedAction(message: string): any {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('cycle') || lowerMessage.includes('règles') || lowerMessage.includes('ovulation')) {
    return { type: 'navigate', target: 'cycle', label: 'Ouvrir Mon Cycle' };
  } else if (lowerMessage.includes('médicament') || lowerMessage.includes('santé') || lowerMessage.includes('symptôme') || lowerMessage.includes('paludisme') || lowerMessage.includes('tension')) {
    return { type: 'navigate', target: 'sante', label: 'Ouvrir l\'Espace Santé' };
  } else if (lowerMessage.includes('agenda') || lowerMessage.includes('rendez-vous') || lowerMessage.includes('rdv') || lowerMessage.includes('calendrier')) {
    return { type: 'navigate', target: 'agenda', label: 'Consulter mon Agenda' };
  } else if (lowerMessage.includes('sport') || lowerMessage.includes('workout') || lowerMessage.includes('calisthenics') || lowerMessage.includes('entraînement') || lowerMessage.includes('énergie') || lowerMessage.includes('energie') || lowerMessage.includes('exercice') || lowerMessage.includes('pompes') || lowerMessage.includes('squats') || lowerMessage.includes('fentes') || lowerMessage.includes('gainage')) {
    return { type: 'navigate', target: 'sport', label: 'Ouvrir l\'Espace ÉNERGIE' };
  } else if (lowerMessage.includes('planner') || lowerMessage.includes('planning') || lowerMessage.includes('journée') || lowerMessage.includes('routine') || lowerMessage.includes('tâche')) {
    return { type: 'navigate', target: 'planner', label: 'Ouvrir Planner OREA' };
  } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('manger') || lowerMessage.includes('repas') || lowerMessage.includes('safou')) {
    return { type: 'navigate', target: 'nutrition', label: 'Consulter Nutrition OREA' };
  } else if (lowerMessage.includes('bac') || lowerMessage.includes('syscohada') || lowerMessage.includes('comptabilité') || lowerMessage.includes('révision') || lowerMessage.includes('cours')) {
    return { type: 'navigate', target: 'education', label: 'Accéder aux révisions BAC G2' };
  } else if (lowerMessage.includes('finance') || lowerMessage.includes('budget') || lowerMessage.includes('fcfa') || lowerMessage.includes('épargne')) {
    return { type: 'navigate', target: 'finance', label: 'Consulter mon budget FCFA' };
  } else if (lowerMessage.includes('urgence') || lowerMessage.includes('danger') || lowerMessage.includes('secours') || lowerMessage.includes('samu')) {
    return { type: 'navigate', target: 'urgence', label: 'Accéder aux Urgences OREA' };
  }
  return null;
}

// 3. Central OREA Assistant powered by Gemini Resilience Engine (POST /api/assistant/chat)
app.post('/api/assistant/chat', async (req, res) => {
  try {
    // 1. Authenticate user from Firebase token
    const authenticatedUser = await authenticateFirebaseUser(req);

    const { message, category, conversationHistory, userContext, modelRequested } = req.body || {};

    const isDev = process.env.NODE_ENV !== 'production';
    const isUserAuth = authenticatedUser && !authenticatedUser.isAnonymous && !authenticatedUser.uid.startsWith('guest_');

    if (isDev) {
      console.log('[OREA AI] Request started');
      console.log(`[OREA AI] User authenticated: ${isUserAuth}`);
      console.log(`[OREA AI] UID available: ${!!authenticatedUser?.uid}`);
      console.log(`[OREA AI] API key configured: ${!!process.env.GEMINI_API_KEY}`);
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message requis' });
    }

    // 2. Deterministic Priority Safety Check
    const lowerMessage = message.toLowerCase();
    for (const kw of EMERGENCY_KEYWORDS) {
      if (lowerMessage.includes(kw)) {
        return res.json({
          reply: `🚨 **ALERTE DE SÉCURITÉ PRIORITAIRE**\n\nVotre message contient un terme d'urgence potentielle (*${kw}*). OREA ne peut traiter les urgences médicales.\n\n**Action immédiate recommandée :**\n- Contactez immédiatement le **SAMU (112)** ou les **Pompiers (118)**.\n- Si vous êtes au Congo : **CHU de Brazzaville (+242 06 669 35 35)** ou **Hôpital Général de Loandjili à Pointe-Noire**.\n- Ne restez pas seul(e) et demandez immédiatement l'aide d'un proche.`,
          isEmergency: true,
          action: {
            type: 'navigate',
            target: 'urgence',
            label: 'Ouvrir les Urgences OREA',
          },
        });
      }
    }

    const suggestedAction = detectSuggestedAction(message);

    // 3. Build selective minimal context (max 6 recent messages + OREA module summaries)
    const recentHistoryText = Array.isArray(conversationHistory) && conversationHistory.length > 0
      ? conversationHistory.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Utilisateur' : 'OREA'}: ${h.text}`).join('\n')
      : '';

    const moduleSummariesText = (isUserAuth && userContext?.configuredModules)
      ? `[Aperçu des Espaces OREA du Membre]
- Mon Cycle: ${userContext.cycleSummary || 'Non configuré'}
- Sport: ${userContext.sportSummary || 'Non configuré'}
- Nutrition: ${userContext.nutritionSummary || 'Non configuré'}
- BAC G2: ${userContext.educationSummary || 'Non configuré'}
- Finance: ${userContext.financeSummary || 'Non configuré'}
- Planner: ${userContext.plannerSummary || 'Non configuré'}`
      : '[Aucune donnée utilisateur accessible - Mode visiteur public générique d\'OREA]';

    const userPromptContent = `[Contexte utilisateur ${isUserAuth ? 'authentifié' : 'non-authentifié (visiteur public)'} OREA]
Prénom : ${isUserAuth ? (authenticatedUser.name || userContext?.firstName || 'Membre OREA') : 'Visiteur public'}
Email : ${isUserAuth ? (authenticatedUser.email || '') : ''}
Espace OREA actif : ${category || 'Mon OREA Dashboard'}

${moduleSummariesText}

${recentHistoryText ? `[Historique récent du dialogue]\n${recentHistoryText}\n\n` : ''}[Demande de l'utilisateur]
"${message}"

Génère la réponse la plus pertinente, chaleureuse et structurée possible selon les directives OREA :`;

    const systemInstruction = buildOreaSystemPrompt();

    // 4. Generate content with centralized resilience (exponential backoff, jitter, circuit breaker)
    const { text, model } = await generateContentWithResilience({
      userPrompt: userPromptContent,
      systemInstruction,
      requestedModel: modelRequested,
    });

    if (isDev) {
      console.log(`[OREA AI] Model used: ${model}`);
      console.log('[OREA AI] Assistant response delivered');
    }

    res.json({
      reply: text,
      model,
      action: suggestedAction,
    });
  } catch (error: any) {
    console.error(`[OREA AI] Gemini request failed: ${error?.message || error}`);
    res.status(503).json({
      error: 'OREA n’a pas pu générer cette réponse pour le moment.',
      reply: 'OREA n’a pas pu générer cette réponse pour le moment.',
      retryable: true,
      action: detectSuggestedAction(req.body?.message || ''),
    });
  }
});

// 3.B Streaming Assistant Endpoint via Gemini Resilience Engine (SSE)
app.post('/api/assistant/chat-stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // 1. Verify authenticated user
  const authenticatedUser = await authenticateFirebaseUser(req);

  const {
    message = '',
    category = 'general',
    userContext = {},
    conversationHistory = [],
    modelRequested,
  } = req.body || {};

  const isDev = process.env.NODE_ENV !== 'production';
  const isUserAuth = authenticatedUser && !authenticatedUser.isAnonymous && !authenticatedUser.uid.startsWith('guest_');

  if (isDev) {
    console.log('[OREA AI Stream] Request started');
    console.log(`[OREA AI Stream] User authenticated: ${isUserAuth}`);
    console.log(`[OREA AI Stream] UID available: ${!!authenticatedUser?.uid}`);
    console.log(`[OREA AI Stream] API key configured: ${!!process.env.GEMINI_API_KEY}`);
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.write(`data: ${JSON.stringify({ error: 'Message requis' })}\n\n`);
    return res.end();
  }

  // 2. Deterministic triage check
  const lowerMessage = String(message).toLowerCase();
  for (const kw of EMERGENCY_KEYWORDS) {
    if (lowerMessage.includes(kw)) {
      const emergencyReply = `🚨 **ALERTE DE SÉCURITÉ PRIORITAIRE**\n\nVotre message contient un terme d'urgence potentielle (*${kw}*). OREA ne peut traiter les urgences médicales.\n\n**Action immédiate recommandée :**\n- Contactez immédiatement le **SAMU (112)** ou les **Pompiers (118)**.\n- Si vous êtes au Congo : **CHU de Brazzaville (+242 06 669 35 35)** ou **Hôpital Général de Loandjili à Pointe-Noire**.\n- Ne restez pas seul(e) et demandez immédiatement l'aide d'un proche.`;
      res.write(`data: ${JSON.stringify({ chunk: emergencyReply, isEmergency: true })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, action: { type: 'navigate', target: 'urgence', label: 'Ouvrir les Urgences OREA' } })}\n\n`);
      return res.end();
    }
  }

  const suggestedAction = detectSuggestedAction(message);
  const systemInstruction = buildOreaSystemPrompt();

  const recentHistoryText = Array.isArray(conversationHistory) && conversationHistory.length > 0
    ? conversationHistory.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Utilisateur' : 'OREA'}: ${h.text}`).join('\n')
    : '';

  const moduleSummariesText = (isUserAuth && userContext?.configuredModules)
    ? `[Aperçu des Espaces OREA du Membre]
- Mon Cycle: ${userContext.cycleSummary || 'Non configuré'}
- Sport: ${userContext.sportSummary || 'Non configuré'}
- Nutrition: ${userContext.nutritionSummary || 'Non configuré'}
- BAC G2: ${userContext.educationSummary || 'Non configuré'}
- Finance: ${userContext.financeSummary || 'Non configuré'}
- Planner: ${userContext.plannerSummary || 'Non configuré'}`
    : '[Aucune donnée utilisateur accessible - Mode visiteur public générique d\'OREA]';

  const userPromptContent = `[Contexte utilisateur ${isUserAuth ? 'authentifié' : 'non-authentifié (visiteur public)'} OREA]
Prénom : ${isUserAuth ? (authenticatedUser.name || userContext?.firstName || 'Ami(e) d\'OREA') : 'Visiteur public'}
Email : ${isUserAuth ? (authenticatedUser.email || '') : ''}
Espace OREA actif : ${category || 'Général'}

${moduleSummariesText}

${recentHistoryText ? `[Historique récent pertinent]\n${recentHistoryText}\n\n` : ''}[Message de l'utilisateur]
"${message}"

Génère la réponse avec Gemini selon les directives OREA :`;

  try {
    let finalModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    for await (const { chunkText, model } of streamContentWithResilience({
      userPrompt: userPromptContent,
      systemInstruction,
      requestedModel: modelRequested,
    })) {
      finalModel = model;
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    if (isDev) {
      console.log(`[OREA AI Stream] Delivered with model: ${finalModel}`);
    }
    res.write(`data: ${JSON.stringify({ done: true, action: suggestedAction, model: finalModel })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error(`[OREA AI Stream Error]: ${err?.message || err}`);
    res.write(
      `data: ${JSON.stringify({
        error: 'OREA n’a pas pu générer cette réponse pour le moment.',
        retryable: true,
        done: true,
      })}\n\n`
    );
    res.end();
  }
});

// 4. Data persistence API (for real persistence across tabs/sessions)
app.post('/api/user/save-profile', (req, res) => {
  const { userId = 'default_user', profile } = req.body || {};
  localDatabase.userProfiles[userId] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, profile: localDatabase.userProfiles[userId] });
});

app.get('/api/user/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'default_user';
  res.json({ success: true, profile: localDatabase.userProfiles[userId] || null });
});

app.post('/api/cycle/save-entry', (req, res) => {
  const { userId = 'default_user', entry } = req.body || {};
  if (!localDatabase.cycleData[userId]) {
    localDatabase.cycleData[userId] = [];
  }
  const newEntry = {
    id: entry.id || `cycle_${Date.now()}`,
    ...entry,
    createdAt: new Date().toISOString(),
  };
  localDatabase.cycleData[userId].push(newEntry);
  res.json({ success: true, entry: newEntry });
});

app.get('/api/cycle/entries', (req, res) => {
  const userId = (req.query.userId as string) || 'default_user';
  res.json({ success: true, entries: localDatabase.cycleData[userId] || [] });
});

// ----------------------------------------------------
// OREA PAIEMENTS & ABONNEMENTS
// ----------------------------------------------------

// Création d'une transaction de paiement sécurisée
app.post('/api/payments/create', async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      userName,
      planId,
      billingCycle,
      amount,
      currency = 'XAF',
      provider: providerId,
      phoneNumber,
      cardNumberMasked,
    } = req.body;

    if (!userId || !planId || !billingCycle || !amount || !providerId) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis manquants (userId, planId, billingCycle, amount, provider)',
      });
    }

    const provider = getPaymentProvider(providerId as PaymentProviderId);
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    // Initialiser la transaction auprès du provider
    const providerResp = await provider.createPayment({
      paymentId,
      userId,
      userEmail: userEmail || 'utilisateur@orea.app',
      userName: userName || 'Membre OREA',
      planId,
      billingCycle,
      amount: Number(amount),
      currency,
      phoneNumber,
      cardNumberMasked,
    });

    const transactionRecord = {
      id: paymentId,
      userId,
      userEmail: userEmail || '',
      userName: userName || 'Membre OREA',
      planId,
      billingCycle,
      amount: Number(amount),
      currency,
      provider: providerId,
      phoneNumber: phoneNumber || null,
      status: providerResp.status,
      transactionReference: providerResp.transactionReference,
      instructions: providerResp.instructions,
      requiresUssdPrompt: Boolean(providerResp.requiresUssdPrompt),
      createdAt: now,
      updatedAt: now,
    };

    localDatabase.payments[paymentId] = transactionRecord;

    console.log(`[OREA Paiement] Transaction initiée: ${paymentId} (${providerId}, ${amount} ${currency}, ${planId})`);

    res.json({
      success: true,
      payment: transactionRecord,
      instructions: providerResp.instructions,
      requiresUssdPrompt: providerResp.requiresUssdPrompt,
      redirectUrl: providerResp.redirectUrl,
    });
  } catch (err: any) {
    console.error('[OREA Paiement Erreur]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Erreur lors de l’initialisation du paiement',
    });
  }
});

// Vérification réelle et activation de l'abonnement
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { paymentId, transactionReference } = req.body;

    if (!paymentId) {
      return res.status(400).json({ success: false, error: 'paymentId requis' });
    }

    const payment = localDatabase.payments[paymentId];
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Transaction non trouvée' });
    }

    const provider = getPaymentProvider(payment.provider as PaymentProviderId);
    const verification = await provider.verifyPayment(paymentId, transactionReference || payment.transactionReference);

    const now = new Date();
    const nowIso = now.toISOString();

    if (verification.isConfirmed && verification.status === 'successful') {
      payment.status = 'successful';
      payment.updatedAt = nowIso;

      // Calcul réel de l'expiration (+1 mois ou +1 an)
      const expiresDate = new Date(now);
      if (payment.billingCycle === 'yearly') {
        expiresDate.setFullYear(expiresDate.getFullYear() + 1);
      } else {
        expiresDate.setMonth(expiresDate.getMonth() + 1);
      }

      const featuresMap = calculateUserFeaturesMap(payment.planId);

      const subscription = {
        planId: payment.planId,
        billingCycle: payment.billingCycle,
        status: 'active',
        startedAt: nowIso,
        expiresAt: expiresDate.toISOString(),
        paymentProvider: payment.provider,
        lastPaymentId: paymentId,
      };

      // Sauvegarder dans le profil utilisateur en cache avec tous les champs exacts
      if (!localDatabase.userProfiles[payment.userId]) {
        localDatabase.userProfiles[payment.userId] = { uid: payment.userId };
      }
      const uProfile = localDatabase.userProfiles[payment.userId];
      uProfile.plan = payment.planId;
      uProfile.subscription_status = 'active';
      uProfile.subscription_start = nowIso;
      uProfile.subscription_end = expiresDate.toISOString();
      uProfile.payment_status = 'paid';
      uProfile.features = featuresMap;
      uProfile.subscription = subscription;

      console.log(`[OREA Paiement Validé] Abonnement ${payment.planId} (${payment.billingCycle}) activé pour ${payment.userId} jusqu'au ${expiresDate.toLocaleDateString('fr-FR')}`);

      return res.json({
        success: true,
        status: 'successful',
        isConfirmed: true,
        payment,
        subscription,
        plan: payment.planId,
        subscription_status: 'active',
        subscription_start: nowIso,
        subscription_end: expiresDate.toISOString(),
        payment_status: 'paid',
        features: featuresMap,
      });
    }

    // Si le paiement est toujours en attente
    payment.status = verification.status;
    payment.updatedAt = nowIso;

    res.json({
      success: false,
      status: verification.status,
      isConfirmed: false,
      payment,
      message: 'Transaction en cours de traitement',
    });
  } catch (err: any) {
    console.error('[OREA Paiement Vérif Erreur]', err);
    res.status(500).json({ success: false, error: err.message || 'Erreur lors de la vérification' });
  }
});

// ----------------------------------------------------
// CONTRÔLE DES ACCÈS CÔTÉ SERVEUR (hasFeature API)
// ----------------------------------------------------

// Vérification centralisée des droits d'accès
app.post('/api/subscription/check-access', (req, res) => {
  const { userId, feature, userProfile } = req.body;
  const targetUser = (userId && localDatabase.userProfiles[userId]) || userProfile || null;
  const allowed = serverHasFeature(targetUser, feature);

  res.json({
    success: true,
    feature,
    allowed,
    userPlan: targetUser?.plan || targetUser?.subscription?.planId || 'free',
  });
});

// Récupération de la carte complète des fonctionnalités pour un utilisateur
app.get('/api/subscription/user-features/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = localDatabase.userProfiles[userId];
  const plan = user?.plan || user?.subscription?.planId || 'free';
  const status = user?.subscription_status || user?.subscription?.status || (plan === 'free' ? 'active' : 'inactive');
  const features = calculateUserFeaturesMap(plan);

  res.json({
    success: true,
    userId,
    plan,
    status,
    features,
  });
});

// ----------------------------------------------------
// MULTI-PROFILS FAMILIAUX (PRO REQUIREMENT: max 4 profils)
// ----------------------------------------------------

app.get('/api/family-profiles/:userId', (req, res) => {
  const userId = req.params.userId;
  const list = localDatabase.familyProfiles[userId] || [];
  res.json({ success: true, profiles: list });
});

app.post('/api/family-profiles/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = localDatabase.userProfiles[userId];

  // Gating : doit avoir la fonctionnalité family_profiles (Pro ou Admin)
  if (!serverHasFeature(user, 'family_profiles')) {
    return res.status(403).json({
      success: false,
      error: 'Cette fonctionnalité nécessite le forfait OREA Pro (jusqu’à 4 profils familiaux).',
      requiredPlan: 'pro',
    });
  }

  if (!localDatabase.familyProfiles[userId]) {
    localDatabase.familyProfiles[userId] = [];
  }

  const existing = localDatabase.familyProfiles[userId];
  if (existing.length >= 4) {
    return res.status(400).json({
      success: false,
      error: 'Limite atteinte : un compte OREA Pro permet au maximum 4 profils familiaux.',
    });
  }

  const { name, relationship, avatarColor, age, nutrition, preferences } = req.body;
  const newProfile = {
    id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name || 'Membre de la famille',
    relationship: relationship || 'autre',
    avatarColor: avatarColor || '#0056d6',
    age: age || null,
    habits: [],
    agenda: [],
    sportsData: { workoutGoal: 'Maintien de la forme', completedSessions: 0 },
    nutrition: nutrition || { hydrationTargetGlasses: 8, dietaryPreference: 'Équilibrée' },
    budget: { monthlyAllowanceFcfa: 0, spentFcfa: 0 },
    educationProgress: { subject: 'Général', score: 0 },
    preferences: preferences || {},
    createdAt: new Date().toISOString(),
  };

  existing.push(newProfile);
  res.json({ success: true, profile: newProfile, profiles: existing });
});

app.put('/api/family-profiles/:userId/:profileId', (req, res) => {
  const { userId, profileId } = req.params;
  const existing = localDatabase.familyProfiles[userId] || [];
  const idx = existing.findIndex((p) => p.id === profileId);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Profil introuvable' });
  }

  existing[idx] = {
    ...existing[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, profile: existing[idx], profiles: existing });
});

app.delete('/api/family-profiles/:userId/:profileId', (req, res) => {
  const { userId, profileId } = req.params;
  if (!localDatabase.familyProfiles[userId]) {
    return res.status(404).json({ success: false, error: 'Profil introuvable' });
  }

  localDatabase.familyProfiles[userId] = localDatabase.familyProfiles[userId].filter(
    (p) => p.id !== profileId
  );
  res.json({ success: true, profiles: localDatabase.familyProfiles[userId] });
});

// ----------------------------------------------------
// ARCHITECTURE OREA BUSINESS (Écoles, Universités, Entreprises)
// ----------------------------------------------------

app.post('/api/business/organization/create', (req, res) => {
  const { adminUid, adminEmail, name, orgType, maxSeats = 50 } = req.body;

  if (!adminUid || !name || !orgType) {
    return res.status(400).json({ success: false, error: 'Champs requis manquants' });
  }

  const orgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newOrg = {
    id: orgId,
    name,
    orgType,
    adminUid,
    adminEmail: adminEmail || '',
    membersCount: 1,
    maxSeats,
    members: [
      {
        uid: adminUid,
        email: adminEmail,
        name: 'Administrateur Principal',
        role: 'admin',
        joinedAt: new Date().toISOString(),
        status: 'active',
      },
    ],
    customPathways: ['BAC G2 Accéléré', 'Gestion Financière Entreprise', 'Bien-être & Nutrition Pro'],
    billingStatus: 'devis',
    createdAt: new Date().toISOString(),
  };

  localDatabase.businessOrgs[adminUid] = newOrg;
  res.json({ success: true, organization: newOrg });
});

app.get('/api/business/organization/:adminUid', (req, res) => {
  const org = localDatabase.businessOrgs[req.params.adminUid];
  if (!org) {
    return res.json({ success: false, organization: null });
  }
  res.json({ success: true, organization: org });
});

app.post('/api/business/organization/:adminUid/members', (req, res) => {
  const org = localDatabase.businessOrgs[req.params.adminUid];
  if (!org) {
    return res.status(404).json({ success: false, error: 'Organisation introuvable' });
  }

  const { email, name, role = 'student' } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Email et nom requis' });
  }

  const newMember = {
    email,
    name,
    role,
    joinedAt: new Date().toISOString(),
    status: 'active' as const,
  };

  org.members.push(newMember);
  org.membersCount = org.members.length;

  res.json({ success: true, organization: org, member: newMember });
});

// ----------------------------------------------------
// PROGRESSION & RÉSULTATS DU MODULE BAC G2
// ----------------------------------------------------

app.get('/api/bac-g2/progress/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = localDatabase.userProfiles[userId];

  // Gating : Premium, Pro ou Admin requis pour voir la progression complète
  const hasAccess = serverHasFeature(user, 'bac_g2_module');
  const history = localDatabase.bacG2Progress[userId] || [];

  res.json({
    success: true,
    hasAccess,
    history,
  });
});

app.post('/api/bac-g2/progress/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = localDatabase.userProfiles[userId];

  if (!serverHasFeature(user, 'bac_g2_module')) {
    return res.status(403).json({
      success: false,
      error: 'Le module complet BAC G2 est réservé aux membres OREA Premium.',
      requiredPlan: 'premium',
    });
  }

  if (!localDatabase.bacG2Progress[userId]) {
    localDatabase.bacG2Progress[userId] = [];
  }

  const { subject, quizId, score, totalQuestions, examSimulation = false } = req.body;
  const entry = {
    id: `bac_${Date.now()}`,
    subject: subject || 'Comptabilité Générale',
    quizId,
    score: Number(score) || 0,
    totalQuestions: Number(totalQuestions) || 5,
    percentage: Math.round(((Number(score) || 0) / (Number(totalQuestions) || 5)) * 100),
    examSimulation: Boolean(examSimulation),
    completedAt: new Date().toISOString(),
  };

  localDatabase.bacG2Progress[userId].push(entry);
  res.json({ success: true, progressEntry: entry });
});

// Statut d'une transaction
app.get('/api/payments/status/:paymentId', (req, res) => {
  const payment = localDatabase.payments[req.params.paymentId];
  if (!payment) {
    return res.status(404).json({ success: false, error: 'Transaction non trouvée' });
  }
  res.json({ success: true, payment });
});

// Historique des paiements de l'utilisateur
app.get('/api/payments/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const userPayments = Object.values(localDatabase.payments).filter(
    (p: any) => p.userId === userId
  );
  res.json({ success: true, payments: userPayments });
});

// Annuler une transaction
app.post('/api/payments/cancel', (req, res) => {
  const { paymentId } = req.body;
  const payment = localDatabase.payments[paymentId];
  if (payment && payment.status === 'pending') {
    payment.status = 'cancelled';
    payment.updatedAt = new Date().toISOString();
    return res.json({ success: true, payment });
  }
  res.status(400).json({ success: false, error: 'Transaction introuvable ou déjà traitée' });
});

// ----------------------------------------------------
// ROUTES SEO & INDEXATION TECHNIQUE (ROBOTS.TXT & SITEMAP.XML)
// ----------------------------------------------------

function getServerSiteOrigin(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const forwardedProto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'oreasante.com';
  return `${forwardedProto}://${host}`;
}

// Robots.txt conforme Googlebot avec exclusion absolue des zones privées
app.get('/robots.txt', (req, res) => {
  const siteOrigin = getServerSiteOrigin(req);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(`# robots.txt pour OREA Santé
# Découverte et indexation par Googlebot et moteurs de recherche
User-agent: *
Allow: /
Allow: /sante
Allow: /urgence
Allow: /medicaments
Allow: /agenda
Allow: /tarifs
Allow: /pricing
Allow: /symptom-checker
Allow: /encyclopedie
Allow: /hydratation
Allow: /confidentialite
Allow: /conditions-utilisation
Allow: /preferences-cookies
Allow: /orea-logo.png
Allow: /orea-symbol.svg
Allow: /orea-logo.svg
Allow: /orea-logo.jpg
Allow: /manifest.webmanifest
Allow: /assets/

# Autoriser le rendu CSS et JS
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.svg$
Allow: /*.webp$
Allow: /*.woff$
Allow: /*.woff2$

# Exclusion absolue des espaces privés, authentifiés et données personnelles
Disallow: /mon-orea
Disallow: /mon-orea/
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /connexion
Disallow: /connexion/
Disallow: /inscription
Disallow: /inscription/
Disallow: /login
Disallow: /register
Disallow: /checkout
Disallow: /checkout/
Disallow: /payment-pending
Disallow: /payment-success
Disallow: /payment-failed
Disallow: /assistant
Disallow: /assistant/
Disallow: /famille
Disallow: /famille/
Disallow: /documents
Disallow: /documents/
Disallow: /habitudes
Disallow: /habitudes/
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteOrigin}/sitemap.xml
`);
});

// Sitemap XML dynamique pour Google Search Console
app.get('/sitemap.xml', (req, res) => {
  const siteOrigin = getServerSiteOrigin(req);
  const today = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Accueil OREA -->
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Espaces Publics de Santé & Secours -->
  <url>
    <loc>${siteOrigin}/sante</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteOrigin}/urgence</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteOrigin}/medicaments</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteOrigin}/agenda</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Tarifs & Abonnements -->
  <url>
    <loc>${siteOrigin}/tarifs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Outils et Calculateurs -->
  <url>
    <loc>${siteOrigin}/symptom-checker</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteOrigin}/encyclopedie</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteOrigin}/hydratation</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <!-- Conformité & Données -->
  <url>
    <loc>${siteOrigin}/confidentialite</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteOrigin}/conditions-utilisation</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteOrigin}/preferences-cookies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`);
});

// Start Express + Vite Middleware in development, or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur OREA Full-Stack démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
