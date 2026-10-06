import React, { useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  User,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Activity,
  Calendar,
  GraduationCap,
  HeartPulse,
  Wallet,
  Loader2,
} from 'lucide-react';
import { OreaChatMessage } from '../../lib/firebase';
import { OreaAiAvatar } from './OreaAiAvatar';

interface ChatMessageListProps {
  messages: OreaChatMessage[];
  streamingText?: string;
  isThinking?: boolean;
  isStreaming?: boolean;
  onNavigateSection?: (section: string) => void;
  onRetry?: (failedMessage: OreaChatMessage) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  streamingText,
  isThinking,
  isStreaming,
  onNavigateSection,
  onRetry,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isThinking, isStreaming]);

  // Helper to render contextual module action icon
  const getActionIcon = (target: string) => {
    switch (target) {
      case 'sante':
      case 'urgence':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'cycle':
        return <Sparkles className="w-3.5 h-3.5 text-pink-300" />;
      case 'sport':
      case 'workout':
        return <Activity className="w-3.5 h-3.5 text-orange-300" />;
      case 'planner':
        return <Calendar className="w-3.5 h-3.5 text-sky-300" />;
      case 'education':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />;
      case 'finance':
        return <Wallet className="w-3.5 h-3.5 text-emerald-300" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isEmergency =
          msg.content.toLowerCase().includes('urgence vitale') ||
          msg.content.toLowerCase().includes('secours') ||
          msg.content.toLowerCase().includes('112') ||
          msg.content.toLowerCase().includes('118');

        return (
          <div
            key={msg.messageId}
            className={`flex items-start gap-3 sm:gap-4 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* OREA EVA Avatar */}
            {!isUser && (
              <div className="shrink-0 mt-0.5">
                <OreaAiAvatar
                  size="sm"
                  state={msg.isError ? 'error' : 'idle'}
                />
              </div>
            )}

            {/* Bubble Container */}
            <div
              className={`max-w-[88%] sm:max-w-[78%] p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed transition-all ${
                isUser
                  ? 'bg-[#0056d6] text-white rounded-br-xs shadow-xs'
                  : isEmergency
                  ? 'bg-red-50/90 border border-red-300 text-red-950 rounded-bl-xs shadow-xs'
                  : 'bg-white border border-[#e2edf8] text-[#0f2347] rounded-bl-xs shadow-xs'
              }`}
            >
              {/* Emergency Banner */}
              {isEmergency && !isUser && (
                <div className="flex items-center gap-2 text-red-700 font-bold mb-3 pb-2 border-b border-red-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">
                    Alerte Urgence Médicale Détectée
                  </span>
                </div>
              )}

              {/* Message Content */}
              {isUser ? (
                <p className="whitespace-pre-line text-white font-normal">
                  {msg.content}
                </p>
              ) : msg.isError || msg.content.includes('OREA n’a pas pu générer cette réponse pour le moment') ? (
                <div className="space-y-3 py-1">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>OREA n’a pas pu générer cette réponse pour le moment.</span>
                  </div>
                  {onRetry && (
                    <button
                      onClick={() => onRetry(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réessayer</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
              )}

              {/* Integrated OREA Action Button */}
              {msg.action && onNavigateSection && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onNavigateSection(msg.action?.target || 'accueil')}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0056d6] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                  >
                    {getActionIcon(msg.action.target)}
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[10px] mt-2 text-right ${
                  isUser ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
          </div>
        );
      })}

      {/* Streaming or Thinking Active Message */}
      {(isThinking || isStreaming || streamingText) && (
        <div className="flex items-start gap-3 sm:gap-4 justify-start animate-in fade-in duration-150">
          <div className="shrink-0 mt-0.5">
            <OreaAiAvatar
              size="sm"
              state={isThinking && !streamingText ? 'thinking' : 'streaming'}
            />
          </div>

          <div className="max-w-[88%] sm:max-w-[78%] p-4 sm:p-5 rounded-3xl bg-white border border-[#e2edf8] text-[#0f2347] rounded-bl-xs shadow-xs text-xs sm:text-sm leading-relaxed">
            {/* Status Phase Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold mb-2.5 pb-1.5 border-b border-slate-100 text-[#0056d6]">
              {isThinking && !streamingText ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>OREA réfléchit…</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>OREA écrit…</span>
                </>
              )}
            </div>

            {/* Progressive markdown stream */}
            {streamingText ? (
              <div className="markdown-body">
                <Markdown>{streamingText}</Markdown>
              </div>
            ) : (
              <p className="text-slate-400 italic text-xs">
                Formulation de la réponse en cours...
              </p>
            )}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
