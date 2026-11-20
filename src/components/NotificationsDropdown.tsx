import React from 'react';
import { AppNotification, NotificationType } from '../types/library';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  BookOpen,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Inbox,
  ChevronRight,
} from 'lucide-react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentUserId: string; // studentId or 'gerant' or 'invite'
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onOpenAllNotificationsModal: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUserId,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenAllNotificationsModal,
}) => {
  if (!isOpen) return null;

  // Filter notifications relevant to current user role
  const userNotifications = notifications.filter(
    n => n.recipientId === currentUserId || n.recipientId === 'all'
  );

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'request_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'request_rejected':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      case 'request_created':
        return <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'return_reminder_3days':
      case 'return_reminder_1day':
      case 'return_reminder_today':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'return_overdue':
        return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      case 'return_confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'book_suggested':
        return <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Dropdown Header */}
      <div className="px-4 py-3 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-mono text-[10px] font-bold">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-medium text-amber-300 hover:text-amber-200 underline transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-stone-400 space-y-2">
            <Inbox className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-semibold text-stone-600">Aucune notification</p>
            <p className="text-[11px] text-stone-400">
              Vous serez notifié lors du suivi de vos demandes et restitutions.
            </p>
          </div>
        ) : (
          userNotifications.slice(0, 8).map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) onMarkAsRead(notif.id);
              }}
              className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                !notif.isRead
                  ? 'bg-amber-50/50 hover:bg-amber-100/40'
                  : 'bg-white hover:bg-stone-50'
              }`}
            >
              {/* Type Icon */}
              {getNotificationIcon(notif.type)}

              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs ${!notif.isRead ? 'font-bold text-stone-900' : 'font-semibold text-stone-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className={`text-[11px] leading-relaxed ${!notif.isRead ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>
                  {notif.message}
                </p>
              </div>

              {/* Unread dot / Mark read button */}
              {!notif.isRead ? (
                <span
                  title="Marquer comme lu"
                  className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5 ring-2 ring-amber-200"
                />
              ) : (
                <Check className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAllNotificationsModal();
          }}
          className="w-full py-1.5 px-3 text-xs font-bold text-stone-800 hover:text-amber-800 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>Toutes les notifications (Historique complet)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
