import React, { useState } from 'react';
import { Send, Sparkles, User, AlertCircle, RefreshCw, Calendar, ArrowRight, Check } from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import { OreaAiAvatar } from '../assistant/OreaAiAvatar';
import { NavSection } from '../../types';
import { getModuleProfile, isModuleConfigured } from '../../utils/oreaProfileStorage';
import { logUserActivity, saveUserObjective, getFirebaseIdToken } from '../../lib/firebase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  action?: {
    type: string;
    target: string;
    label: string;
  } | null;
  hasAppliedAction?: boolean;
}

interface OreaDashboardAiCardProps {
  userId: string;
  userFirstName: string;
  userEmail?: string;
  onNavigate?: (section: NavSection) => void;
}

export const OreaDashboardAiCard: React.FC<OreaDashboardAiCardProps> = ({
  userId,
  userFirstName,
  userEmail,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<'gemini-3.6-flash' | 'gemini-flash-latest'>('gemini-3.6-flash');
  const [errorState, setErrorState] = useState<string | null>(null);
  const [appliedActionMsg, setAppliedActionMsg] = useState<string | null>(null);

  const suggestions = [
    { label: '🤖 Organiser ma journée', query: 'Organise ma journée et propose-moi un planning optimisé pour aujourd\'hui.' },
    { label: '🎯 Analyser mes objectifs', query: 'Analyse mes objectifs actuels et donne-moi des conseils stratégiques pour les atteindre.' },
    { label: '📊 Voir ma progression', query: 'Où en suis-je dans ma progression globale OREA sur l\'ensemble de mes espaces ?' },
    { label: '📅 Optimiser mon planning', query: 'Comment puis-je mieux structurer mon temps et éviter la surcharge dans mon agenda ?' },
    { label: '📚 M\'aider à étudier', query: 'Aide-moi à réviser la comptabilité SYSCOHADA et les matières du BAC G2.' },
    { label: '🏋️ Préparer ma séance', query: 'Que puis-je faire pour ma séance de sport et calisthenics aujourd\'hui ?' },
    { label: '🍲 M\'aider avec mes repas', query: 'Propose-moi un repas équilibré basé sur la nutrition locale du terroir (safou, manioc, moringa).' },
    { label: '💰 Analyser mon budget', query: 'Comment puis-je optimiser mon budget personnel en FCFA selon la règle 50/30/20 ?' },
    { label: '❤️ Comprendre mon suivi', query: 'Explique-moi les principes du suivi de santé et d\'hygiène de vie OREA.' },
  ];

  const gatherUserContext = () => {
    // Collect local module profiles to build a tailored prompt
    const cycle = getModuleProfile('cycle')?.answers;
    const sport = getModuleProfile('sport')?.answers;
    const nutrition = getModuleProfile('nutrition')?.answers;
    const education = getModuleProfile('education')?.answers;
    const finance = getModuleProfile('finance')?.answers;
    const planner = getModuleProfile('planner')?.answers;

    return {
      userId,
      firstName: userFirstName,
      email: userEmail,
      configuredModules: {
        cycle: isModuleConfigured('cycle'),
        sport: isModuleConfigured('sport'),
        nutrition: isModuleConfigured('nutrition'),
        education: isModuleConfigured('education'),
        finance: isModuleConfigured('finance'),
        planner: isModuleConfigured('planner'),
      },
      cycleSummary: cycle ? `Cycle actif (pseudo: ${cycle.pseudo || ''})` : 'Non configuré',
      sportSummary: sport ? `Niveau: ${sport.level || 'Débutant'}` : 'Non configuré',
      nutritionSummary: nutrition ? `Objectif: ${nutrition.goal || 'Équilibre'}` : 'Non configuré',
      educationSummary: education ? `Série: ${education.series || 'BAC G2'}` : 'Non configuré',
      financeSummary: finance ? `Devise: FCFA` : 'Non configuré',
      plannerSummary: planner ? `Planning actif` : 'Non configuré',
    };
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    setErrorState(null);
    const userMsgId = `msg_${Date.now()}_u`;
    const userMsg: Message = { id: userMsgId, role: 'user', content: queryText.trim() };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const contextData = gatherUserContext();
      const idToken = await getFirebaseIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
      
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: queryText.trim(),
          category: 'mon_orea_dashboard',
          userContext: contextData,
          modelRequested: activeModel,
          conversationHistory: updatedHistory.slice(-6).map((m) => ({
            sender: m.role,
            text: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Votre IA OREA est momentanément indisponible.');
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: data.reply || 'Désolé, je n\'ai pas pu générer une réponse.',
        model: data.model || activeModel,
        action: data.action || (queryText.toLowerCase().includes('organise') || queryText.toLowerCase().includes('planning') 
          ? { type: 'apply_planner', target: 'planner', label: 'Appliquer au Planner' } 
          : null),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('[IA OREA Dashboard Error]:', err);
      setErrorState(err.message || 'Votre IA OREA est momentanément indisponible.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPlannerAction = async (msgId: string) => {
    if (!userId) return;
    try {
      await logUserActivity(userId, {
        title: 'Planning optimisé par Votre IA OREA',
        description: 'Recommandations de planification appliquées avec succès.',
        module: 'planner',
        type: 'autre',
      });

      await saveUserObjective(userId, {
        title: 'Suivre la routine IA du jour (OREA Planner)',
        module: 'planner',
        targetDate: new Date().toISOString().split('T')[0],
        status: 'en_cours',
        progress: 10,
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, hasAppliedAction: true } : m))
      );

      setAppliedActionMsg('La proposition a été enregistrée dans vos objectifs et votre activité OREA Planner !');
      setTimeout(() => setAppliedActionMsg(null), 4000);
    } catch (e) {
      console.error('Error applying action:', e);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0f2347] via-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-blue-900/40 relative overflow-hidden space-y-5">
      {/* Decorative Glow background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-blue-900/50 pb-4">
        <div className="flex items-center gap-3">
          <OreaAiAvatar
            size="md"
            state={loading ? 'thinking' : 'idle'}
            showGlowRing={true}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                VOTRE IA OREA
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Propulsé par {activeModel === 'gemini-3.6-flash' ? 'Gemini 3.6 Flash' : 'Gemini Flash'}
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              Bonjour <strong className="text-white">{userFirstName}</strong> 👋 Comment puis-je vous aider aujourd'hui ?
            </p>
          </div>
        </div>

        {/* Model switcher badge toggle */}
        <div className="flex items-center gap-1.5 bg-blue-950/80 p-1 rounded-xl border border-blue-800/40 self-start sm:self-auto">
          <button
            onClick={() => setActiveModel('gemini-3.6-flash')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              activeModel === 'gemini-3.6-flash'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flash 3.6
          </button>
          <button
            onClick={() => setActiveModel('gemini-flash-latest')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              activeModel === 'gemini-flash-latest'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flash Plus
          </button>
        </div>
      </div>

      {appliedActionMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedActionMsg}</span>
        </div>
      )}

      {/* Conversation Window (renders when messages exist) */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="shrink-0 mt-0.5">
                  <OreaAiAvatar size="xs" state="idle" />
                </div>
              )}

              <div className="space-y-2 max-w-xl">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#0056d6] text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60 shadow-md'
                  }`}
                >
                  {m.content}
                </div>

                {/* Interactive Action Button for AI Proposal */}
                {m.role === 'assistant' && m.action && (
                  <div className="flex items-center gap-2 pt-1">
                    {m.action.type === 'apply_planner' && (
                      <button
                        disabled={m.hasAppliedAction}
                        onClick={() => handleApplyPlannerAction(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          m.hasAppliedAction
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {m.hasAppliedAction ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Appliqué au Planner</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Appliquer au Planner</span>
                          </>
                        )}
                      </button>
                    )}

                    {onNavigate && m.action.target && (
                      <button
                        onClick={() => onNavigate(m.action!.target as NavSection)}
                        className="px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>{m.action.label || 'Voir mon espace'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-950/60 border border-blue-800/40 text-blue-200 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
          <span>🤖 Votre IA OREA réfléchit avec {activeModel === 'gemini-3.6-flash' ? 'Gemini 3.6 Flash' : 'Gemini Flash'}...</span>
        </div>
      )}

      {/* Controlled Error State */}
      {errorState && (
        <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorState}</span>
          </div>
          <button
            onClick={() => handleSendQuery(input || 'Bonjour OREA')}
            className="px-3 py-1 rounded-xl bg-red-900 hover:bg-red-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(input);
        }}
        className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-blue-800/50 shadow-inner"
      >
        <input
          type="text"
          placeholder="Posez votre question à OREA..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-[#0056d6] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <span>Envoyer</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Suggestion Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Suggestions rapides :
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(s.query)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/40 hover:border-blue-500/50 text-blue-200 text-[11px] font-semibold transition-all cursor-pointer text-left"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
