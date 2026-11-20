import React, { useState } from 'react';
import { AppNotification, NotificationType } from '../types/library';
import {
  X,
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  Sparkles,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Inbox,
  Calendar,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentUserId: string; // studentId or 'gerant' or 'invite'
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onClearAllNotifications: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUserId,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAllNotifications,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'requests' | 'reminders'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter notifications relevant to current user role
  const userNotifications = notifications.filter(
    n => n.recipientId === currentUserId || n.recipientId === 'all'
  );

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const filteredList = userNotifications.filter(n => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.bookTitle && n.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'unread') return !n.isRead;
    if (filter === 'requests') {
      return (
        n.type === 'request_accepted' ||
        n.type === 'request_rejected' ||
        n.type === 'request_created'
      );
    }
    if (filter === 'reminders') {
      return (
        n.type === 'return_reminder_3days' ||
        n.type === 'return_reminder_1day' ||
        n.type === 'return_reminder_today' ||
        n.type === 'return_overdue' ||
        n.type === 'return_confirmed'
      );
    }
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'request_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
      case 'request_rejected':
        return <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
      case 'request_created':
        return <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
      case 'return_reminder_3days':
      case 'return_reminder_1day':
      case 'return_reminder_today':
        return <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
      case 'return_overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
      case 'return_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
      case 'book_suggested':
        return <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />;
      default:
        return <Bell className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Toutes les notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-mono text-xs font-bold">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Historique complet des alertes, demandes et rappels de restitution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par titre de livre ou mot-clé..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Tout marquer lu</span>
                </button>
              )}

              {userNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Voulez-vous effacer tout l'historique des notifications ?")) {
                      onClearAllNotifications();
                    }
                  }}
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 rounded-xl transition-colors"
                  title="Vider l'historique"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Toutes ({userNotifications.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'unread'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Non lues ({unreadCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter('requests')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'requests'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Demandes d'emprunt
            </button>

            <button
              type="button"
              onClick={() => setFilter('reminders')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === 'reminders'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Rappels & Retards
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-stone-100 text-xs">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-stone-400 space-y-2">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-700 text-sm">Aucune notification correspondant à votre filtre</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Vos demandes d'emprunt, acceptations, refus et rappels de restitution apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            filteredList.map(notif => (
              <div
                key={notif.id}
                className={`py-4 px-3 rounded-xl transition-all flex items-start justify-between gap-4 group ${
                  !notif.isRead ? 'bg-amber-50/60 border border-amber-200' : 'hover:bg-stone-50/80'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {getNotificationIcon(notif.type)}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xs ${!notif.isRead ? 'font-bold text-stone-900' : 'font-semibold text-stone-800'}`}>
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{notif.timestamp}</span>
                      </span>
                      {notif.bookTitle && (
                        <span className="text-amber-800 font-semibold truncate max-w-[200px]">
                          « {notif.bookTitle} »
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-200 rounded-lg transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteNotification(notif.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Supprimer la notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>{filteredList.length} notification(s) affichée(s)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
