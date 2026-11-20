import { Book, BookCopy, StudentMember, Loan, ActivityLog, BookInquiry, UserSessionMode, LoanRequest, AppNotification } from '../types/library';
import { INITIAL_BOOKS, INITIAL_COPIES, INITIAL_STUDENTS, INITIAL_LOANS, INITIAL_ACTIVITIES, INITIAL_REQUESTS, INITIAL_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  BOOKS: 'usmba_libris_books_v5',
  COPIES: 'usmba_libris_copies_v5',
  STUDENTS: 'usmba_libris_students_v5',
  LOANS: 'usmba_libris_loans_v5',
  ACTIVITIES: 'usmba_libris_activities_v5',
  INQUIRIES: 'usmba_libris_inquiries_v5',
  SESSION_MODE: 'usmba_libris_session_mode_v5',
  ACTIVE_STUDENT_ID: 'usmba_libris_active_student_id_v5',
  CART: 'usmba_libris_cart_v5',
  REQUESTS: 'usmba_libris_requests_v6',
  NOTIFICATIONS: 'usmba_libris_notifications_v1'
};

export const CURRENT_DATE = '2026-11-09';

// Met à jour dynamiquement les statuts des prêts en comparant avec CURRENT_DATE
export function updateLoanStatuses(loans: Loan[]): Loan[] {
  return loans.map(loan => {
    if (loan.returnDate) {
      return { ...loan, status: 'returned' };
    }
    if (loan.dueDate < CURRENT_DATE) {
      return { ...loan, status: 'overdue' };
    }
    return { ...loan, status: 'active' };
  });
}

export function loadBooks(): Book[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (data) {
      const parsed: Book[] = JSON.parse(data);
      const initMap = new Map(INITIAL_BOOKS.map(b => [b.id, b]));
      return parsed.map(b => {
        const init = initMap.get(b.id);
        return {
          ...b,
          coverUrl: b.coverUrl || init?.coverUrl,
        };
      });
    }
  } catch (e) {
    console.error('Failed to load books from localStorage', e);
  }
  return INITIAL_BOOKS;
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books', e);
  }
}

export function loadCopies(): BookCopy[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COPIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load copies from localStorage', e);
  }
  return INITIAL_COPIES;
}

export function saveCopies(copies: BookCopy[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COPIES, JSON.stringify(copies));
  } catch (e) {
    console.error('Failed to save copies', e);
  }
}

export function loadStudents(): StudentMember[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStudents(students: StudentMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function loadLoans(): Loan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (data) {
      const parsed: Loan[] = JSON.parse(data);
      return updateLoanStatuses(parsed);
    }
  } catch (e) {
    console.error('Failed to load loans from localStorage', e);
  }
  return updateLoanStatuses(INITIAL_LOANS);
}

export function saveLoans(loans: Loan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  } catch (e) {
    console.error('Failed to save loans', e);
  }
}

export function loadActivities(): ActivityLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load activities', e);
  }
  return INITIAL_ACTIVITIES;
}

export function saveActivities(activities: ActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities', e);
  }
}

export function loadInquiries(): BookInquiry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load inquiries', e);
  }
  return [];
}

export function saveInquiries(inquiries: BookInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
}

export function loadRequests(): LoanRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load requests from localStorage', e);
  }
  return INITIAL_REQUESTS;
}

export function saveRequests(requests: LoanRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

// Par défaut : l'utilisateur entre comme invité ('invite')
export function loadUserSessionMode(): UserSessionMode {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_MODE);
    if (data === 'invite' || data === 'etudiant' || data === 'gerant') return data;
  } catch (e) {}
  return 'invite'; // Entre comme invité par défaut
}

export function saveUserSessionMode(mode: UserSessionMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_MODE, mode);
  } catch (e) {}
}

export function loadActiveStudentId(): string | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    if (data) return data;
  } catch (e) {}
  return null;
}

export function saveActiveStudentId(studentId: string | null): void {
  try {
    if (studentId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, studentId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    }
  } catch (e) {}
}

export function loadCart(): import('../types/library').CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
  }
  return [];
}

export function saveCart(cart: import('../types/library').CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

export function loadNotifications(): AppNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load notifications from localStorage', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function resetToDemoData(): void {
  localStorage.removeItem(STORAGE_KEYS.BOOKS);
  localStorage.removeItem(STORAGE_KEYS.COPIES);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.LOANS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
  localStorage.removeItem(STORAGE_KEYS.SESSION_MODE);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
  localStorage.removeItem(STORAGE_KEYS.CART);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
}

export function calculateDaysDifference(dateString: string, baseDate = CURRENT_DATE): number {
  const d1 = new Date(dateString).getTime();
  const d2 = new Date(baseDate).getTime();
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}
