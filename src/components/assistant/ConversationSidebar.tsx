import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit2,
  Archive,
  ArchiveRestore,
  X,
  Check,
  AlertTriangle,
  Loader2,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { OreaConversation } from '../../lib/firebase';
import { OREALogo } from '../OREALogo';

interface ConversationSidebarProps {
  conversations: OreaConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => Promise<void>;
  onArchiveConversation: (id: string, isArchived: boolean) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  isLoading: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onBackToHome: () => void;
  currentUser?: any | null;
  onSignInGoogle?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onArchiveConversation,
  onDeleteConversation,
  isLoading,
  isOpenMobile,
  onCloseMobile,
  onBackToHome,
  currentUser,
  onSignInGoogle,
  onSignOut,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close 3-dots menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.lastMessageSnippet && c.lastMessageSnippet.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Group conversations by time periods: Aujourd'hui, Hier, 7 derniers jours, Plus ancien
  const grouped = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const sevenDaysStart = todayStart - 6 * 86400000;

    const res: {
      today: OreaConversation[];
      yesterday: OreaConversation[];
      lastWeek: OreaConversation[];
      older: OreaConversation[];
    } = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    filteredConversations.forEach((conv) => {
      const dateVal = new Date(conv.updatedAt || conv.createdAt).getTime();
      if (dateVal >= todayStart) {
        res.today.push(conv);
      } else if (dateVal >= yesterdayStart) {
        res.yesterday.push(conv);
      } else if (dateVal >= sevenDaysStart) {
        res.lastWeek.push(conv);
      } else {
        res.older.push(conv);
      }
    });

    return res;
  }, [filteredConversations]);

  const handleStartRename = (conv: OreaConversation) => {
    setRenamingId(conv.id);
    setRenameValue(conv.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = async (id: string) => {
    if (renameValue.trim()) {
      await onRenameConversation(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsDeleting(true);
      await onDeleteConversation(deleteConfirmId);
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderGroup = (title: string, items: OreaConversation[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
          {title}
        </h4>
        <div className="space-y-0.5">
          {items.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const isMenuOpen = menuOpenId === conv.id;
            const isEditing = renamingId === conv.id;

            return (
              <div
                key={conv.id}
                className={`relative group rounded-xl px-2.5 py-2 transition-colors flex items-center justify-between text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#e7f0fd] text-[#0056d6] font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
                onClick={() => {
                  if (!isEditing) {
                    onSelectConversation(conv.id);
                    onCloseMobile();
                  }
                }}
              >
                {isEditing ? (
                  <div
                    className="flex items-center gap-1.5 w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(conv.id);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      autoFocus
                      className="flex-1 text-xs px-2 py-1 bg-white rounded border border-[#0056d6] outline-none text-[#0f2347]"
                    />
                    <button
                      onClick={() => handleSaveRename(conv.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRenamingId(null)}
                      className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <MessageSquare
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#0056d6]' : 'text-slate-400'
                        }`}
                      />
                      <span className="text-xs truncate block leading-snug">
                        {conv.title}
                      </span>
                    </div>

                    {/* 3-dots Menu trigger */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpenId(isMenuOpen ? null : conv.id)
                        }
                        className={`p-1 rounded-md transition-opacity cursor-pointer ${
                          isMenuOpen || isActive
                            ? 'opacity-100 text-slate-600 hover:bg-white/80'
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Options"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#e2edf8] rounded-xl shadow-lg py-1 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => handleStartRename(conv)}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Renommer</span>
                          </button>
                          <button
                            onClick={() => {
                              onArchiveConversation(conv.id, !conv.isArchived);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
                          >
                            {conv.isArchived ? (
                              <>
                                <ArchiveRestore className="w-3.5 h-3.5 text-slate-500" />
                                <span>Désarchiver</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3.5 h-3.5 text-slate-500" />
                                <span>Archiver</span>
                              </>
                            )}
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            onClick={() => {
                              setDeleteConfirmId(conv.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const content = (
    <div className="h-full flex flex-col bg-[#f8fbfe] border-r border-[#e2edf8] w-72 sm:w-80 select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-[#e2edf8] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <OREALogo
            variant="compact"
            size="small"
            animated={true}
            clickable={true}
            onClick={onBackToHome}
          />
          <div className="border-l border-slate-200 pl-2">
            <span className="text-[11px] font-bold text-[#0B2F5B] block leading-none">
              Assistant
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Firestore
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={() => {
            onNewConversation();
            onCloseMobile();
          }}
          className="w-full py-2.5 px-3.5 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle discussion</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une discussion..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e2edf8] rounded-xl text-xs text-[#0f2347] placeholder-slate-400 outline-none focus:border-[#0056d6] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading && conversations.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0056d6]" />
            <span>Chargement de vos discussions...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-10 text-center px-4">
            <p className="text-xs text-slate-400">
              {searchQuery
                ? `Aucune discussion trouvée pour "${searchQuery}".`
                : 'Aucune discussion pour le moment. Cliquez sur "Nouvelle discussion" pour commencer !'}
            </p>
          </div>
        ) : (
          <>
            {renderGroup("Aujourd'hui", grouped.today)}
            {renderGroup('Hier', grouped.yesterday)}
            {renderGroup('Cette semaine', grouped.lastWeek)}
            {renderGroup('Plus ancien', grouped.older)}
          </>
        )}
      </div>

      {/* User Authentication Status */}
      <div className="p-3 border-t border-[#e2edf8] bg-slate-50/70">
        {currentUser && !currentUser.isAnonymous ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Utilisateur'}
                  className="w-7 h-7 rounded-full object-cover border border-[#cbd5e1] shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#0056d6] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-[#0f2347] truncate">
                    {currentUser.displayName || 'Utilisateur'}
                  </p>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Connecté" />
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Se déconnecter"
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={onSignInGoogle}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#cbd5e1] hover:bg-slate-50 text-xs font-semibold text-[#0f2347] shadow-2xs hover:border-[#0056d6] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Sauvegarde cloud de vos discussions
            </p>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#e2edf8] bg-white flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connecté Firestore</span>
        </div>
        <button
          onClick={onBackToHome}
          className="hover:text-[#0056d6] transition-colors cursor-pointer font-medium"
        >
          Portail OREA →
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#dbeaf8] p-5 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0f2347]">
                Supprimer définitivement cette discussion ?
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Cette action est irréversible et effacera l'historique complet de cette conversation sur vos serveurs OREA.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Supprimer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-full shrink-0">{content}</div>

      {/* Mobile / Tablet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-2xl h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
