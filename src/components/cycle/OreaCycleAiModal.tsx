import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Heart, AlertCircle } from 'lucide-react';
import { CycleCalculationResult } from '../../types/cycle';

interface OreaCycleAiModalProps {
  isOpen: boolean;
  userFirstName: string;
  cycleStats: CycleCalculationResult;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const PRESET_QUESTIONS = [
  'Explique-moi simplement la phase dans laquelle je me trouve.',
  'Qu’est-ce que la phase folliculaire et que faire ?',
  'Quelles tisanes naturelles pour apaiser les crampes ?',
  'Comment adapter mon alimentation en phase lutéale ?'
];

export const OreaCycleAiModal: React.FC<OreaCycleAiModalProps> = ({
  isOpen,
  userFirstName,
  cycleStats,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-ai',
      sender: 'assistant',
      text: `Bonjour ${userFirstName} 🌸. Je suis Votre IA d'accompagnement OREA. Je peux vous expliquer les phases physiologiques de votre cycle, vous suggérer des conseils bien-être naturels ou reformuler vos repères. Comment puis-je vous éclairer aujourd'hui ?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call server-side /api/assistant or local fallback educational intelligence
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: `Espace Mon Cycle OREA. Utilisatrice : ${userFirstName}. Phase active calculée par OREA : ${cycleStats.currentPhase} (Jour ${cycleStats.currentDay}). Durée moyenne : ${cycleStats.averageCycleDays} jours. Rappel : Vous ne calculez pas les dates (elles sont déterministes par OREA), vous apportez uniquement des explications pédagogiques, bienveillantes, respectueuses, et vous ne posez aucun diagnostic médical.`
        })
      });

      let reply = '';
      if (response.ok) {
        const data = await response.json();
        reply = data.reply || data.message || '';
      }

      if (!reply) {
        // High quality educational fallback
        const lower = textToSend.toLowerCase();
        if (lower.includes('phase') || lower.includes('actuelle') || lower.includes('trouve')) {
          reply = `Vous êtes actuellement en phase ${cycleStats.currentPhase} (Jour ${cycleStats.currentDay}). Durant cette période, votre organisme ${
            cycleStats.currentPhase === 'menstruelle'
              ? 'se régénère et a besoin de repos, de chaleur locale et d’aliments riches en fer.'
              : cycleStats.currentPhase === 'folliculaire'
              ? 'bénéficie de la montée des œstrogènes, ce qui favorise l’énergie physique et la créativité.'
              : cycleStats.currentPhase === 'ovulatoire'
              ? 'atteint un pic hormonal et de vitalité. Une hydratation soutenue est recommandée.'
              : 'produit de la progestérone. Pensez au magnésium (chocolat noir, bananes) et aux étirements doux.'
          }`;
        } else if (lower.includes('crampe') || lower.includes('douleur') || lower.includes('tisane')) {
          reply = `Pour apaiser naturellement les crampes ou tiraillements habituels : appliquez une bouillotte tiède sur le bas-ventre, buvez des infusions tièdes de gingembre doux ou de bissap (hibiscus), et privilégiez des étirements doux du bassin. Si la douleur est aiguë ou inhabituelle, consultez un professionnel de santé.`;
        } else if (lower.includes('lutéale') || lower.includes('luteale') || lower.includes('manger') || lower.includes('alimentation')) {
          reply = `Pendant la phase lutéale, l’organisme apprécie les aliments riches en magnésium (graines de courge, banane plantain, cacao brut) et en vitamines du groupe B. Limiter le sel et la caféine aide également à réduire les sensations de gonflement.`;
        } else {
          reply = `Votre cycle menstruel est un rythme naturel guidé par les variations hormonales d’œstrogènes et de progestérone. Être à l’écoute de ses ressentis (sommeil, hydratation, énergie) permet de vivre chaque phase en harmonie.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `En phase ${cycleStats.currentPhase}, écoutez votre corps : privilégiez le confort, une bonne hydratation et des repas équilibrés.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Poser une question à Votre IA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accompagnement pédagogique OREA & conseils bien-être
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-700 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white font-medium rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800 rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 py-2">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
              <span>Votre IA prépare votre explication...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Posez votre question sur votre cycle..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 text-xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
