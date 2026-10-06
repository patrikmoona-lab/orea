import React, { useState } from 'react';
import { Send, Sparkles, User, AlertCircle } from 'lucide-react';
import { OreaAiAvatar } from '../assistant/OreaAiAvatar';
import { OreaButton } from '../common/OreaButton';
import { getFirebaseIdToken } from '../../lib/firebase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const OreaAiAssistantTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Bonjour ! Je suis **Votre IA OREA**, votre assistant intelligent personnel. Je peux vous guider sur vos 6 espaces OREA (Cycle, Sport, Nutrition, BAC G2, Finance et Planner). Comment puis-je vous aider aujourd\'hui ?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

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
          category: 'general',
          conversationHistory: messages.slice(-6).map((m) => ({
            sender: m.role === 'user' ? 'user' : 'assistant',
            text: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur de réponse de l\'assistant IA');
      }

      const data = await res.json();
      const reply = data.reply || 'Désolé, je n\'ai pas pu traiter votre demande pour le moment.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.warn('AI Assistant fallback:', err);
      // Fallback response in case backend endpoint is offline
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Je suis l\'assistant IA d\'OREA. OREA a été créé et fondé par Mr Tsoumou Patrick Bonheur. N\'hésitez pas à utiliser vos espaces personnels OREA pour organiser votre quotidien !',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <OreaAiAvatar size="sm" state={loading ? 'thinking' : 'idle'} showGlowRing={true} />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
            INTELLIGENCE ARTIFICIELLE OREA
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">Votre IA OREA — Assistant Personnel</h2>
        <p className="text-xs text-purple-200 mt-1">
          Posez vos questions sur la santé, les études du BAC G2, le sport, la nutrition ou votre budget.
        </p>
      </div>

      {/* Medical / Educational Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Note éducative :</strong> Votre IA OREA fournit des conseils d'accompagnement et d'organisation. En cas de problème de santé grave, consultez toujours un professionnel de santé.
        </span>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="shrink-0 mt-0.5">
                  <OreaAiAvatar size="xs" state="idle" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#0056d6] text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>Votre IA OREA réfléchit...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2">
          <input
            type="text"
            placeholder="Posez votre question à Votre IA OREA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
          />
          <OreaButton
            type="submit"
            variant="primary"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-2xl"
          >
            <Send className="w-4 h-4" />
          </OreaButton>
        </form>
      </div>
    </div>
  );
};
