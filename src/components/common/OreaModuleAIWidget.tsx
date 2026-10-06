import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, User, Loader2, MessageSquare, RotateCcw } from 'lucide-react';
import { OreaAiAvatar } from '../assistant/OreaAiAvatar';
import { OreaUserProfile } from '../../types';
import { getFirebaseIdToken } from '../../lib/firebase';

interface OreaModuleAIWidgetProps {
  moduleId: 'cycle' | 'sport' | 'nutrition' | 'education' | 'finance' | 'planner';
  moduleTitle: string;
  currentUserProfile?: OreaUserProfile | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const OreaModuleAIWidget: React.FC<OreaModuleAIWidgetProps> = ({
  moduleId,
  moduleTitle,
  currentUserProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const storageKey = currentUserProfile?.uid
    ? `${moduleId}_ai_conversations_${currentUserProfile.uid}`
    : `${moduleId}_ai_conversations_guest`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Bonjour ! Je suis **Votre IA OREA** spécialisée pour l'espace **${moduleTitle}**. Posez-moi vos questions, analysez vos données ou demandez-moi des conseils personnalisés.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Retrieve profile data from localStorage for context
    let moduleProfileData = {};
    try {
      const pSaved = localStorage.getItem(`orea_profile_${moduleId}`);
      if (pSaved) moduleProfileData = JSON.parse(pSaved);
    } catch {
      // ignore
    }

    try {
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
          message: userText,
          category: moduleId,
          conversationHistory: messages,
          userContext: {
            firstName: currentUserProfile?.firstName || currentUserProfile?.displayName || (moduleProfileData as any).pseudo || 'Membre OREA',
            email: currentUserProfile?.email || '',
            moduleProfile: moduleProfileData,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de communication avec l\'IA');
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Voici ma réponse basée sur votre espace OREA.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      // Fallback intelligent
      const fallbackReplies: Record<string, string> = {
        cycle: `D'après vos données de cycle, il est recommandé d'écouter votre corps et d'hydrater régulièrement. En cas de doute ou de douleur persistante, consultez un professionnel de santé.`,
        sport: `Pour progresser régulièrement dans votre programme, maintenez la régularité et veillez à bien récupérer entre chaque séance.`,
        nutrition: `Privilégiez les super-aliments locaux et une hydratation optimale (eau, bissap sans sucre ajouté) tout au long de la journée.`,
        education: `Pour réviser efficacement, procédez par sessions courtes et régulières en vous testant régulièrement sur les points clés du programme BAC G2.`,
        finance: `Le secret d'une épargne sereine réside dans le suivi rigoureux de vos charges fixes et la constitution progressive de votre fonds de sécurité.`,
        planner: `Répartissez vos tâches par blocs de concentration de 45 minutes, en intercalant de courtes pauses pour maintenir votre énergie.`,
      };

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackReplies[moduleId] || `Je suis à votre écoute pour vous accompagner dans votre espace ${moduleTitle}. Comment puis-je vous aider ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Historique réinitialisé. Comment puis-je vous aider dans votre espace **${moduleTitle}** ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Button (Mobile & Desktop FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#0056d6] to-[#00A6C7] text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/30 group"
          title="Votre IA OREA"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
          <span className="hidden sm:inline-block font-extrabold text-xs tracking-wide">
            Votre IA OREA
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
        </button>
      )}

      {/* Chat Modal / Slide-over Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[600px] rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f2347] to-[#0056d6] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-yellow-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Votre IA OREA</h3>
                  <p className="text-[11px] text-blue-200 font-medium">Contexte : {moduleTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearHistory}
                  title="Réinitialiser la conversation"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Fermer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${
                    m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <div className="w-8 h-8 rounded-xl bg-[#0056d6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="shrink-0 mt-0.5">
                      <OreaAiAvatar size="xs" state="idle" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0056d6] text-white rounded-tr-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`block text-[10px] mt-1.5 text-right font-medium ${
                        m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <OreaAiAvatar size="xs" state="thinking" />
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0056d6]" />
                    <span>L'IA réfléchit...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Posez une question sur ${moduleTitle}...`}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0056d6]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#0056d6] hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
