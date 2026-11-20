import { AppNotification, Loan, Book, NotificationType } from '../types/library';
import { calculateDaysDifference, CURRENT_DATE } from './storage';

/**
 * Checks all active loans and generates dynamic return deadline notifications if not already created.
 */
export function generateLoanDeadlineNotifications(
  loans: Loan[],
  books: Book[],
  existingNotifications: AppNotification[]
): { updatedNotifications: AppNotification[]; newCount: number } {
  const bookMap = new Map(books.map(b => [b.id, b]));
  const notificationKeys = new Set(
    existingNotifications.map(n => `${n.recipientId}_${n.type}_${n.relatedId}`)
  );

  const newNotifs: AppNotification[] = [];

  for (const loan of loans) {
    if (loan.returnDate) continue; // Skip returned loans

    const book = bookMap.get(loan.bookId);
    const bookTitle = book?.title || 'Ouvrage';
    const daysRemaining = calculateDaysDifference(loan.dueDate, CURRENT_DATE);

    let type: NotificationType | null = null;
    let title = '';
    let message = '';

    if (daysRemaining === 3) {
      type = 'return_reminder_3days';
      title = 'Rappel de restitution (J-3)';
      message = `Rappel : vous devez retourner le livre « ${bookTitle} » dans 3 jours.`;
    } else if (daysRemaining === 1) {
      type = 'return_reminder_1day';
      title = 'Rappel de restitution (J-1)';
      message = `Rappel : vous devez retourner le livre « ${bookTitle} » demain (dans 1 jour).`;
    } else if (daysRemaining === 0) {
      type = 'return_reminder_today';
      title = 'Date limite aujourd\'hui !';
      message = `Attention : aujourd'hui est la date limite pour retourner votre livre « ${bookTitle} ».`;
    } else if (daysRemaining < 0) {
      type = 'return_overdue';
      title = 'Retard de restitution';
      message = `Retard de retour : vous avez dépassé la date limite de restitution de votre livre « ${bookTitle} ». Veuillez le retourner rapidement.`;
    }

    if (type) {
      const key = `${loan.studentId}_${type}_${loan.id}`;
      if (!notificationKeys.has(key)) {
        notificationKeys.add(key);
        newNotifs.push({
          id: `notif-auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          recipientId: loan.studentId,
          title,
          message,
          timestamp: `${CURRENT_DATE} 08:00`,
          date: CURRENT_DATE,
          isRead: false,
          type,
          relatedId: loan.id,
          bookTitle,
          copyNumber: loan.copyNumber,
        });
      }
    }
  }

  if (newNotifs.length === 0) {
    return { updatedNotifications: existingNotifications, newCount: 0 };
  }

  return {
    updatedNotifications: [...newNotifs, ...existingNotifications],
    newCount: newNotifs.length,
  };
}

/**
 * Creates a notification object helper
 */
export function createNotification(
  recipientId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string,
  bookTitle?: string,
  copyNumber?: number,
  recipientName?: string
): AppNotification {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId,
    recipientName,
    title,
    message,
    timestamp: `${CURRENT_DATE} ${timeStr}`,
    date: CURRENT_DATE,
    isRead: false,
    type,
    relatedId,
    bookTitle,
    copyNumber,
  };
}
