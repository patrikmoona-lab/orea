import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  User,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { OreaAiAvatar } from '../assistant/OreaAiAvatar';
import { BacG2Course } from '../../types/bacG2';

interface BacG2AICoachModalProps {
  course: BacG2Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BacG2AICoachModal: React.FC<BacG2AICoachModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: course
        ? `Bonjour ! Je suis votre tuteur IA BAC G2 pour le cours : « ${course.title} ». Posez-moi vos questions sur les écritures comptables, les calculs de TVA, les notions juridiques ou les règles SYSCOHADA !`
        : 'Bonjour ! Je suis votre tuteur IA BAC G2. Posez-moi vos questions pour préparer vos épreuves de Comptabilité, Fiscalité, Droit et SYSCOHADA.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputQuery('');
    setIsTyping(true);

    // AI pedagogical answer generation
    setTimeout(() => {
      let answer = '';
      const lower = userText.toLowerCase();

      if (lower.includes('amortissement') || lower.includes('linéaire') || lower.includes('dégressif')) {
        answer = `Pour les amortissements au BAC G2 :
1. **Amortissement Linéaire** : Annuité = V0 × Taux × (n/12 ou j/360). La première annuité part de la date de mise en service.
2. **Écriture comptable** :
   - Débit : Compte 6813 Dotations aux amortissements
   - Crédit : Compte 28... Amortissements de l'immobilisation concernée.`;
      } else if (lower.includes('tva') || lower.includes('déductible') || lower.includes('collectée')) {
        answer = `En fiscalité BAC G2 (SYSCOHADA) :
- **TVA Collectée (4431)** = Ventes HT × 18% (dette envers l'État)
- **TVA Déductible (445)** = Achats HT × 18% (créance sur l'État)
- **TVA Nette à décaisser (4441)** = TVA Collectée - TVA Déductible - Crédit antérieur.`;
      } else if (lower.includes('bilan') || lower.includes('patrimoine') || lower.includes('frng')) {
        answer = `Pour l'équilibre du Bilan et l'analyse financière :
- **FRNG** = Ressources Stables - Emplois Stables
- **BFR** = Actif Circulant - Passif Circulant
- **Trésorerie Nette** = FRNG - BFR = Disponibilités - Dettes financières court terme.`;
      } else {
        answer = `Dans le cadre du programme officiel du BAC G2 et du SYSCOHADA Révisé :
Il convient d'analyser l'opération sous l'angle de la nomenclature de compte appropriée, en respectant scrupuleusement le principe de la partie double (Débit = Crédit) et l'indépendance des exercices. N'hésitez pas à consulter la fiche méthode du cours !`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[600px] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-800 text-purple-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Assistant IA BAC G2</h3>
              <p className="text-xs text-purple-200">
                {course ? `Assistance pour : ${course.title}` : 'Tuteur pédagogique certifié'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-purple-200 hover:text-white hover:bg-purple-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-purple-50 border-b border-purple-100 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            'Calcul des amortissements ?',
            'Formule de calcul de la TVA ?',
            'Calcul du FRNG & Trésorerie ?',
            'Conditions de validité du contrat ?',
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputQuery(chip);
              }}
              className="px-3 py-1 bg-white hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-lg border border-purple-200 whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.role === 'user' ? (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <div className="shrink-0 mt-0.5">
                  <OreaAiAvatar size="xs" state="idle" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200/80 text-slate-800 shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-600 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Le tuteur prépare votre explication...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Posez votre question pédagogique..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!inputQuery.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
