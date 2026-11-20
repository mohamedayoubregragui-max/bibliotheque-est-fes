import React, { useState } from 'react';
import { UserSessionMode, StudentMember, AppNotification } from '../types/library';
import { Building2, Shield, GraduationCap, LogIn, LogOut, Bell } from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';

interface AppTopBarProps {
  sessionMode: UserSessionMode;
  currentStudent: StudentMember | null;
  onOpenStudentLogin: () => void;
  onOpenManagerLogin: () => void;
  onSwitchToGuest: () => void;
  overdueCount: number;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenAllNotificationsModal: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  sessionMode,
  currentStudent,
  onOpenStudentLogin,
  onOpenManagerLogin,
  onSwitchToGuest,
  overdueCount,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenAllNotificationsModal,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Compute recipient ID for notifications based on active session
  const currentUserId =
    sessionMode === 'etudiant' && currentStudent
      ? currentStudent.id
      : sessionMode === 'gerant'
      ? 'gerant'
      : 'invite';

  const userNotifications = notifications.filter(
    n => n.recipientId === currentUserId || n.recipientId === 'all'
  );

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Institution Brand & Context */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSwitchToGuest}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  Bibliothèque EST Fès
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 border border-amber-400/20">
                  USMBA
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                École Supérieure de Technologie · Université Sidi Mohamed Ben Abdellah
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Access Roles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-stone-800 rounded-lg border border-stone-700">
            {/* Mode Invité / Consultation libre */}
            <button
              onClick={onSwitchToGuest}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                sessionMode === 'invite'
                  ? 'bg-stone-100 text-stone-900 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>Recherche (Invité)</span>
            </button>

            {/* Espace Étudiant USMBA */}
            <button
              onClick={() => {
                if (sessionMode !== 'etudiant') {
                  onOpenStudentLogin();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                sessionMode === 'etudiant'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{sessionMode === 'etudiant' ? 'Mon Compte Étudiant' : 'Connexion Étudiant'}</span>
            </button>

            {/* Espace Gérant */}
            <button
              onClick={onOpenManagerLogin}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative ${
                sessionMode === 'gerant'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Espace Gérant</span>
              {overdueCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-stone-900" />
              )}
            </button>
          </div>
        </div>

        {/* Zone 3: Cloche de Notifications & Profil Session */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 🔔 Notifications Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-all relative flex items-center justify-center ${
                unreadCount > 0
                  ? 'bg-stone-800 text-amber-400 border-amber-500/50 hover:bg-stone-700'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:bg-stone-750'
              }`}
              title="Notifications et rappels"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-stone-950 rounded-full font-mono text-[10px] font-extrabold flex items-center justify-center border-2 border-stone-900 shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            <NotificationsDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              notifications={notifications}
              currentUserId={currentUserId}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
              onOpenAllNotificationsModal={onOpenAllNotificationsModal}
            />
          </div>

          {sessionMode === 'invite' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-mono hidden md:inline">Mode Invité</span>
              <button
                onClick={onOpenStudentLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </button>
            </div>
          )}

          {sessionMode === 'etudiant' && currentStudent && (
            <div className="flex items-center gap-3 bg-stone-800/90 px-3 py-1.5 rounded-lg border border-stone-700">
              <div className="text-right hidden sm:block text-xs">
                <span className="font-semibold text-white block">
                  {currentStudent.firstName} {currentStudent.lastName}
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {currentStudent.institutionalId}
                </span>
              </div>
              <button
                onClick={onSwitchToGuest}
                className="p-1 text-stone-400 hover:text-rose-400 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {sessionMode === 'gerant' && (
            <div className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700 text-xs">
              <Shield className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="font-semibold text-white block">Gérant EST</span>
                <span className="text-[10px] text-stone-400 font-mono">Administration</span>
              </div>
              <button
                onClick={onSwitchToGuest}
                className="ml-2 p-1 text-stone-400 hover:text-rose-400 transition-colors"
                title="Quitter l'espace gérant"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
