import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Sparkles,
  Smile,
  X,
  Compass,
  FileText,
} from 'lucide-react';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onSelectQuickTool?: (toolTopic: string) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isLoading,
  onSelectQuickTool,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Auto-expand textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 160px height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [text]);

  // Close tools menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    let fullText = text.trim();
    if (attachmentName) {
      fullText += `\n[Fichier joint : ${attachmentName}]`;
    }
    onSendMessage(fullText);
    setText('');
    setAttachmentName(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Speech-to-Text via Web Speech API
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechNotice('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const quickTools = [
    { label: '🩺 Question Santé & Symptômes', topic: 'J\'ai une question de santé préventive sur mes symptômes récents :' },
    { label: '📚 BAC G2 SYSCOHADA', topic: 'Aide-moi à réviser la comptabilité SYSCOHADA pour le BAC G2 :' },
    { label: '🏃 Calisthenics & Sport', topic: 'Je veux concevoir une séance de sport au poids du corps :' },
    { label: '🥗 Nutrition & Aliments locaux', topic: 'Quels sont les bienfaits et conseils de préparation des aliments locaux (safou, manioc, moringa) ?' },
    { label: '📅 Organiser ma journée (Planner)', topic: 'Aide-moi à organiser mon planning de la journée de 07h00 à 21h00 :' },
    { label: '💰 Budget en FCFA', topic: 'Comment calculer et répartir mon budget mensuel en FCFA ?' },
    { label: '🩸 Mon Cycle Féminin', topic: 'Peux-tu m\'éclairer sur les phases du cycle féminin et les repères physiologiques ?' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-1">
      {/* Speech notice if unsupported */}
      {speechNotice && (
        <div className="mb-2 flex items-center justify-between px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs animate-in fade-in">
          <span>{speechNotice}</span>
          <button onClick={() => setSpeechNotice(null)} className="p-0.5 hover:text-amber-950 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachment tag preview if file selected */}
      {attachmentName && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs animate-in fade-in">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-medium truncate max-w-xs">{attachmentName}</span>
          <button
            onClick={() => setAttachmentName(null)}
            className="p-0.5 hover:text-blue-950 rounded-full cursor-pointer ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative rounded-2xl bg-white border border-[#dbeaf8] focus-within:border-[#0056d6] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,.pdf,.txt"
        />

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez un message à OREA Assistant... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
          className="w-full px-4 pt-3 pb-2 text-xs sm:text-sm text-[#0f2347] placeholder-slate-400 bg-transparent resize-none outline-none leading-relaxed min-h-[44px]"
        />

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left tools */}
          <div className="flex items-center gap-1">
            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Ajouter un document ou image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Speech Microphone Button */}
            <button
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                isListening
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isListening ? 'Arrêter l\'écoute vocale' : 'Activer la dictée vocale'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Écoute...</span>
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* OREA Quick Tools Button */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-[#0056d6] hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1.5 border border-transparent hover:border-blue-200 cursor-pointer"
                title="Outils et thématiques OREA"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0056d6]" />
                <span className="hidden sm:inline">Outils OREA</span>
              </button>

              {/* Tools Dropdown Menu */}
              {isToolsOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 bg-white border border-[#e2edf8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Thématiques d'accompagnement OREA
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {quickTools.map((qt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setText(qt.topic);
                          setIsToolsOpen(false);
                          textareaRef.current?.focus();
                          if (onSelectQuickTool) onSelectQuickTool(qt.topic);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#0056d6] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium">{qt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right send button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              text.trim() && !isLoading
                ? 'bg-[#0056d6] hover:bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Small disclaimers */}
      <p className="text-[10px] text-center text-slate-400 mt-2">
        OREA Assistant prodigue des conseils préventifs et éducatifs conformes à la charte OREA. En cas d'urgence médicale, contactez le 112 / 118.
      </p>
    </div>
  );
};
