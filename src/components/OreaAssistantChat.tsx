import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Plus,
  ArrowLeft,
  Bot,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  OreaConversation,
  OreaChatMessage,
  ensureFirebaseAuth,
  signInWithGoogle,
  signOutUser,
  getFirebaseIdToken,
  onAuthUserChanged,
  subscribeUserConversations,
  createFirestoreConversation,
  updateFirestoreConversationTitle,
  toggleFirestoreConversationArchive,
  deleteFirestoreConversation,
  subscribeConversationMessages,
  saveFirestoreMessage,
} from '../lib/firebase';
import { ConversationSidebar } from './assistant/ConversationSidebar';
import { ChatQuickSuggestions } from './assistant/ChatQuickSuggestions';
import { ChatMessageList } from './assistant/ChatMessageList';
import { ChatInputBar } from './assistant/ChatInputBar';
import { OreaAiAvatar } from './assistant/OreaAiAvatar';
import { OREALogo } from './OREALogo';

interface OreaAssistantChatProps {
  onBackToHome: () => void;
  onNavigateSection?: (section: any) => void;
}

export const OreaAssistantChat: React.FC<OreaAssistantChatProps> = ({
  onBackToHome,
  onNavigateSection,
}) => {
  const [conversations, setConversations] = useState<OreaConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<OreaChatMessage[]>([]);
  const [userId, setUserId] = useState<string>('anonymous_user');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Streaming states
  const [streamingText, setStreamingText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // 1. Authenticate with Firebase & subscribe to conversations
  useEffect(() => {
    let unsubscribeConvs: (() => void) | null = null;

    const unsubscribeAuth = onAuthUserChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
        if (unsubscribeConvs) unsubscribeConvs();
        setIsLoadingConversations(true);

        unsubscribeConvs = subscribeUserConversations(
          user.uid,
          (convs) => {
            setConversations(convs);
            setIsLoadingConversations(false);
            // If no active conversation, select the most recent or leave ready
            setActiveConversationId((currentActive) => {
              if (currentActive && convs.some((c) => c.id === currentActive)) {
                return currentActive;
              }
              return convs.length > 0 ? convs[0].id : null;
            });
          },
          (err) => {
            console.error('[OREA Assistant] Erreur souscription conversations:', err);
            setIsLoadingConversations(false);
          }
        );
      } else {
        try {
          const anon = await ensureFirebaseAuth();
          setCurrentUser(anon);
          setUserId(anon.uid);
        } catch (err) {
          console.error('[OREA Assistant] Auth error:', err);
          setIsLoadingConversations(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeConvs) unsubscribeConvs();
    };
  }, []);

  // 2. Subscribe to messages of the active conversation
  useEffect(() => {
    if (!activeConversationId || !userId) {
      setMessages([]);
      return;
    }

    const unsubscribeMsgs = subscribeConversationMessages(
      userId,
      activeConversationId,
      (newMessages) => {
        setMessages(newMessages);
      },
      (err) => {
        console.error('[OREA Assistant] Erreur messages conversation:', err);
      }
    );

    return () => {
      unsubscribeMsgs();
    };
  }, [activeConversationId, userId]);

  // Current active conversation document
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Handlers for authentication
  const handleSignInGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      setCurrentUser(user);
      setUserId(user.uid);
    } catch (err) {
      console.error('[OREA Auth Google Error]:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
    } catch (err) {
      console.error('[OREA Sign Out Error]:', err);
    }
  };

  // Handler: Create a new conversation in Firestore
  const handleNewConversation = async () => {
    try {
      const newConv = await createFirestoreConversation(userId, 'Nouvelle discussion');
      setActiveConversationId(newConv.id);
      setMessages([]);
    } catch (err) {
      console.error('[OREA Assistant] Impossible de créer la discussion:', err);
    }
  };

  // Handler: Rename conversation
  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      await updateFirestoreConversationTitle(userId, id, newTitle);
    } catch (err) {
      console.error('[OREA Assistant] Erreur renommage:', err);
    }
  };

  // Handler: Archive conversation
  const handleArchiveConversation = async (id: string, isArchived: boolean) => {
    try {
      await toggleFirestoreConversationArchive(userId, id, isArchived);
    } catch (err) {
      console.error('[OREA Assistant] Erreur archivage:', err);
    }
  };

  // Handler: Delete conversation from Firestore
  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteFirestoreConversation(userId, id);
      if (activeConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id);
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error('[OREA Assistant] Erreur suppression:', err);
    }
  };

  // Handler: Send user message with real-time SSE streaming & Firestore persistence
  const handleSendMessage = async (text: string, category: string = 'general') => {
    if (!text.trim() || isThinking || isStreaming) return;

    let targetConvId = activeConversationId;
    let isFirst = false;

    // If no conversation exists yet, create one in Firestore first (with fallback)
    if (!targetConvId) {
      try {
        const newConv = await createFirestoreConversation(userId, 'Nouvelle discussion');
        targetConvId = newConv.id;
        setActiveConversationId(newConv.id);
        isFirst = true;
      } catch (err) {
        console.warn('[OREA Assistant] Fallback local discussion:', err);
        targetConvId = `conv_${Date.now()}`;
        setActiveConversationId(targetConvId);
        const fallbackConv: OreaConversation = {
          id: targetConvId,
          userId,
          title: 'Nouvelle discussion',
          messageCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false,
        };
        setConversations((prev) => [fallbackConv, ...prev]);
        isFirst = true;
      }
    } else if (messages.length === 0) {
      isFirst = true;
    }

    // A. Optimistic UI update: immediately show user's message
    const userMsg: OreaChatMessage = {
      conversationId: targetConvId,
      messageId: `msg_${Date.now()}`,
      userId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Save user message to Firestore asynchronously
    saveFirestoreMessage(
      userId,
      targetConvId,
      {
        role: 'user',
        content: text,
      },
      { isFirstMessage: isFirst }
    ).catch((err) => console.warn('[Firestore] Sauvegarde message:', err));

    // B. Start Assistant Response (Streaming)
    setIsThinking(true);
    setStreamingText('');

    let accumulatedText = '';
    let suggestedAction: any = null;
    let isErrorMessage = false;

    try {
      // Extract local user profile if available
      let userContext: any = { firstName: 'Ami(e) d\'OREA', city: 'Brazzaville', country: 'Congo' };
      try {
        const stored = localStorage.getItem('orea_user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          userContext = {
            firstName: parsed.firstName || 'Ami(e) d\'OREA',
            city: parsed.city || 'Brazzaville',
            country: parsed.country || 'Congo',
          };
        }
      } catch {
        // ignore
      }

      const recentHistory = messages.slice(-6).map((m) => ({
        sender: m.role,
        text: m.content,
      }));

      // Acquire Firebase ID token for authenticated backend API requests
      const idToken = await getFirebaseIdToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      // Call streaming endpoint
      const response = await fetch('/api/assistant/chat-stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          category,
          userContext,
          conversationHistory: recentHistory,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming non disponible, fallback vers requête classique.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) {
                accumulatedText = data.error;
                isErrorMessage = true;
                setStreamingText(accumulatedText);
                break;
              }
              if (data.chunk) {
                if (!isStreaming) {
                  setIsThinking(false);
                  setIsStreaming(true);
                }
                accumulatedText += data.chunk;
                setStreamingText(accumulatedText);
              }
              if (data.action) {
                suggestedAction = data.action;
              }
              if (data.done) {
                break;
              }
            } catch {
              // skip parse error
            }
          }
        }
      }
    } catch (streamErr) {
      console.warn('[OREA Stream Fallback]', streamErr);
      // Fallback to standard endpoint if stream fails
      try {
        const idToken = await getFirebaseIdToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

        const standardResp = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: text,
            category,
          }),
        });
        const data = await standardResp.json();
        if (data.error || !standardResp.ok) {
          accumulatedText = data.error || 'OREA n’a pas pu générer cette réponse pour le moment.';
          isErrorMessage = true;
        } else {
          accumulatedText = data.reply || 'OREA n’a pas pu générer cette réponse pour le moment.';
        }
        suggestedAction = data.action;
      } catch {
        accumulatedText = 'OREA n’a pas pu générer cette réponse pour le moment.';
        isErrorMessage = true;
      }
    } finally {
      // C. Optimistic UI update for assistant response
      if (accumulatedText && targetConvId) {
        const asstMsg: OreaChatMessage = {
          conversationId: targetConvId,
          messageId: `msg_asst_${Date.now()}`,
          userId,
          role: 'assistant',
          content: accumulatedText,
          createdAt: new Date().toISOString(),
          action: suggestedAction,
          isError: isErrorMessage || accumulatedText.includes('OREA n’a pas pu générer cette réponse pour le moment'),
        };
        setMessages((prev) => {
          if (prev.some((m) => m.content === accumulatedText && m.role === 'assistant')) {
            return prev;
          }
          return [...prev, asstMsg];
        });

        // Save final assistant response to Firestore
        saveFirestoreMessage(userId, targetConvId, {
          role: 'assistant',
          content: accumulatedText,
          action: suggestedAction,
          isError: asstMsg.isError,
        }).catch((saveErr) => {
          console.error('[Firestore] Erreur enregistrement réponse assistant:', saveErr);
        });
      }

      setIsThinking(false);
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleRetryMessage = () => {
    // Locate the last user query to re-issue request
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].content) {
        handleSendMessage(messages[i].content);
        break;
      }
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f8fbfe] text-[#0f2347] overflow-hidden">
      {/* 1. LEFT SIDEBAR (Firestore-backed) */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onArchiveConversation={handleArchiveConversation}
        onDeleteConversation={handleDeleteConversation}
        isLoading={isLoadingConversations}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onBackToHome={onBackToHome}
        currentUser={currentUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
      />

      {/* 2. CENTRAL CONVERSATION AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#f8fbfe]">
        {/* Top Header */}
        <header className="h-14 border-b border-[#e2edf8] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Drawer Trigger (☰) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Ouvrir les discussions"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Conversation Title & Status Badge */}
            <div className="flex items-center gap-2.5 min-w-0">
              <OreaAiAvatar
                size="xs"
                state={isThinking ? 'thinking' : isStreaming ? 'streaming' : 'idle'}
              />

              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-[#0f2347] truncate flex items-center gap-2">
                  <span className="truncate">
                    {activeConversation?.title || 'OREA Assistant'}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini 3.6 Flash
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 truncate hidden md:block">
                  Compagnon d'intelligence holistique • Mémoire Firebase • Santé, Sport, Cycle, Nutrition, BAC G2
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Google Sign-in if anonymous */}
            {(!currentUser || currentUser.isAnonymous) && (
              <button
                onClick={handleSignInGoogle}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#cbd5e1] hover:border-[#0056d6] text-xs font-semibold text-[#0f2347] transition-all shadow-2xs cursor-pointer"
                title="Se connecter avec Google"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Connexion Google</span>
              </button>
            )}

            {/* New Discussion Fast Button */}
            <button
              onClick={handleNewConversation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#0056d6] hover:text-[#0056d6] text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Démarrer une nouvelle discussion"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle discussion</span>
            </button>

            {/* Back to Home Button */}
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-400 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour au portail OREA"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Central Messages or Quick Suggestions */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          {messages.length === 0 && !streamingText && !isThinking ? (
            <ChatQuickSuggestions
              onSelectPrompt={(prompt, cat) => handleSendMessage(prompt, cat)}
              onNavigateSection={onNavigateSection}
            />
          ) : (
            <ChatMessageList
              messages={messages}
              streamingText={streamingText}
              isThinking={isThinking}
              isStreaming={isStreaming}
              onNavigateSection={onNavigateSection}
              onRetry={handleRetryMessage}
            />
          )}
        </div>

        {/* Bottom Input Composer Bar */}
        <div className="shrink-0 bg-gradient-to-t from-[#f8fbfe] via-[#f8fbfe] to-transparent pt-2">
          <ChatInputBar
            onSendMessage={(msg) => handleSendMessage(msg)}
            isLoading={isThinking || isStreaming}
            onSelectQuickTool={(topic) => handleSendMessage(topic)}
          />
        </div>
      </div>
    </div>
  );
};
