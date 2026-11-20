export type UserSessionMode = 'invite' | 'etudiant' | 'gerant';

export interface Chapter {
  number: number;
  title: string;
  page: number;
}

export type CopyCondition = 'Excellent' | 'Bon état' | 'Usure normale' | 'Dégradé';
export type CopyStatus = 'disponible' | 'emprunte' | 'en_maintenance' | 'reserve';

export interface BookCopy {
  id: string; // e.g. "CP-b001-01"
  bookId: string;
  copyNumber: number; // e.g. 1, 2, 3
  barcode: string; // Code barre d'exemplaire
  qrCode: string; // "QR-EST-b001-01"
  shelfLocation: string; // "Rayon L-01 (Étage 1, Travée A, Étagère 2)"
  condition: CopyCondition;
  status: CopyStatus;
  currentLoanId?: string | null;
  acquisitionDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  department: 'Génie Informatique' | 'Génie Électrique' | 'Génie Industriel' | 'Management & Gestion' | 'Sciences Fondamentales';
  publishedYear: number;
  publisher: string;
  shelfLocation: string;
  coverUrl?: string;
  summary: string;
  tableOfContents: Chapter[]; // Sommaire détaillé
  language: string;
  pages: number;
  addedDate: string;
  isSuggested?: boolean; // Pour la sélection d'ouvrages suggérés sur l'accueil
}

export type StudentSector = 'DUT Informatique' | 'DUT Génie Industriel' | 'DUT Génie Électrique' | 'Licence Pro DSI' | 'Licence Pro Mécatronique' | 'DUT Gestion des Entreprises';

export interface StudentMember {
  id: string;
  institutionalId: string; // Identifiant institutionnel USMBA (ex: "USMBA-EST-2024-4982")
  apogeeCode: string; // Code Apogée
  cne: string; // Code National de l'Étudiant (CNE / MASSAR)
  firstName: string;
  lastName: string;
  email: string; // "prenom.nom@usmba.ac.ma"
  phone: string;
  institution: 'EST Fès - USMBA';
  sector: StudentSector;
  studyYear: '1ère Année' | '2ème Année' | 'Licence Pro';
  status: 'active' | 'suspended' | 'graduated';
  registeredDate: string;
  maxAllowedLoans: number; // Règle principale : Max 3 emprunts & demandes au total par étudiant EST
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LoanRequest {
  id: string;
  receiptNumber?: string; // Reçu de réservation (ex: "RES-2026-4928")
  loanId?: string; // ID de l'emprunt généré lors du retrait physique
  studentId: string;
  studentName: string;
  studentInstitutionalId: string;
  bookId: string;
  copyId: string;
  bookTitle: string;
  author: string;
  department: string;
  copyNumber: number;
  qrCode: string;
  shelfLocation: string;
  coverUrl?: string;
  requestDate: string;
  requestTime?: string; // Heure de soumission (ex: "10:45")
  status: RequestStatus;
  rejectionReason?: string;
}

export type LoanStatus = 'active' | 'returned' | 'overdue';

export interface Loan {
  id: string;
  receiptNumber?: string; // Reçu officiel d'emprunt (ex: "REC-2026-8492")
  requestId?: string; // ID de la réservation d'origine
  copyId: string; // Prêt sur un exemplaire précis
  bookId: string;
  copyNumber: number;
  qrCode: string;
  studentId: string; // Étudiant USMBA
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: LoanStatus;
  notes?: string;
  renewalCount: number;
  lastReminderSent?: string;
  remindedCount?: number;
}

export interface CartItem {
  bookId: string;
  copyId: string;
  bookTitle: string;
  author: string;
  department: string;
  shelfLocation: string;
  copyNumber: number;
  qrCode: string;
  coverUrl?: string;
  addedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'loan' | 'return' | 'mass_reminder' | 'mass_import' | 'inquiry_limit';
  description: string;
}

// Limitation des demandes du gérant (max 3 demandes manuelles pour voir les élèves prenant un ouvrage)
export interface BookInquiry {
  bookId: string;
  inquiryTimestamp: string;
}

export type NotificationType =
  | 'request_accepted'
  | 'request_rejected'
  | 'request_created'
  | 'return_reminder_3days'
  | 'return_reminder_1day'
  | 'return_reminder_today'
  | 'return_overdue'
  | 'return_confirmed'
  | 'book_suggested'
  | 'system';

export interface AppNotification {
  id: string;
  recipientId: string; // 'st-001' or 'gerant' or 'all'
  recipientName?: string;
  title: string;
  message: string;
  timestamp: string; // e.g. "2026-11-09 10:15"
  date: string; // e.g. "2026-11-09"
  isRead: boolean;
  type: NotificationType;
  relatedId?: string; // loanId or requestId or bookId
  bookTitle?: string;
  copyNumber?: number;
}

