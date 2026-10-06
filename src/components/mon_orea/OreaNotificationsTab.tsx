import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import {
  fetchUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
  OreaNotificationDoc,
} from '../../lib/firebase';
import { NavSection } from '../../types';

interface OreaNotificationsTabProps {
  userId: string;
  onNavigate?: (section: NavSection) => void;
}

export const OreaNotificationsTab: React.FC<OreaNotificationsTabProps> = ({
  userId,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<OreaNotificationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadNotifs();
  }, [userId]);

  const loadNotifs = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchUserNotifications(userId);
      setNotifications(list);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError('Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!userId) return;
    try {
      await markNotificationAsRead(userId, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    try {
      await deleteUserNotification(userId, id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <Bell className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              MON SUIVI OREA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Centre de Notifications</h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Rappels d’espaces, alertes importantes et informations de compte en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifs}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          {unreadCount > 0 && (
            <OreaButton
              variant="outline"
              onClick={handleMarkAllRead}
              className="shrink-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 py-2.5 px-4"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tout marquer lu</span>
            </OreaButton>
          )}
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit">
          {[
            { id: 'all', label: `Toutes (${notifications.length})` },
            { id: 'unread', label: `Non lues (${unreadCount})` },
            { id: 'read', label: `Lues (${notifications.length - unreadCount})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-[#0056d6] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadNotifs}
            className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto animate-spin mb-3" />
          <p className="text-xs font-medium">Chargement des notifications depuis Firestore...</p>
        </div>
      ) : filteredNotifs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2347]">Vous êtes totalement à jour !</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {filter === 'unread'
              ? 'Toutes vos notifications ont été lues.'
              : 'Aucune notification enregistrée dans cette section.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                !n.read
                  ? 'bg-blue-50/60 border-blue-200 shadow-2xs'
                  : 'bg-white border-slate-200/80 hover:shadow-xs'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0056d6] shrink-0" />
                  )}
                  <h4 className="text-sm font-bold text-[#0f2347]">{n.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-0">{n.message}</p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-[#0056d6] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Marquer comme lu"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lu</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Supprimer la notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
