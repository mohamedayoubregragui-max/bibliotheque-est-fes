import React, { useState, useEffect } from 'react';
import {
  Book,
  BookCopy,
  StudentMember,
  Loan,
  ActivityLog,
  BookInquiry,
  UserSessionMode,
  LoanRequest,
  AppNotification,
} from './types/library';
import {
  loadBooks,
  saveBooks,
  loadCopies,
  saveCopies,
  loadStudents,
  saveStudents,
  loadLoans,
  saveLoans,
  loadActivities,
  saveActivities,
  loadInquiries,
  saveInquiries,
  loadUserSessionMode,
  saveUserSessionMode,
  loadActiveStudentId,
  saveActiveStudentId,
  loadRequests,
  saveRequests,
  loadNotifications,
  saveNotifications,
  CURRENT_DATE,
} from './utils/storage';
import {
  generateLoanDeadlineNotifications,
  createNotification,
} from './utils/notificationsHelper';

// TopBar & Views
import { AppTopBar } from './components/AppTopBar';
import { StudentPortalView } from './components/StudentPortalView';
import { ManagerDashboardView } from './components/ManagerDashboardView';

// Modals & Panels
import { StudentBookModal } from './components/StudentBookModal';
import { MassReminderModal } from './components/MassReminderModal';
import { MassImportModal } from './components/MassImportModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { ManagerLoginModal } from './components/ManagerLoginModal';
import { NotificationsModal } from './components/NotificationsModal';
import { LoanReceiptModal } from './components/LoanReceiptModal';
import { BatchProcessingResult } from './components/ManagerBatchRequestsTable';

export default function App() {
  // Par défaut, l'utilisateur entre comme invité ('invite')
  const [sessionMode, setSessionMode] = useState<UserSessionMode>(() => loadUserSessionMode());
  const [activeStudentId, setActiveStudentId] = useState<string | null>(() => loadActiveStudentId());

  // Domain data
  const [books, setBooks] = useState<Book[]>(() => loadBooks());
  const [copies, setCopies] = useState<BookCopy[]>(() => loadCopies());
  const [students, setStudents] = useState<StudentMember[]>(() => loadStudents());
  const [loans, setLoans] = useState<Loan[]>(() => loadLoans());
  const [requests, setRequests] = useState<LoanRequest[]>(() => loadRequests());
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadActivities());
  const [inquiries, setInquiries] = useState<BookInquiry[]>(() => loadInquiries());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());

  // Modal triggers
  const [bookForDetail, setBookForDetail] = useState<Book | null>(null);
  const [isMassReminderOpen, setIsMassReminderOpen] = useState(false);
  const [massReminderLoanIds, setMassReminderLoanIds] = useState<string[]>([]);
  const [isMassImportOpen, setIsMassImportOpen] = useState(false);
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isManagerLoginOpen, setIsManagerLoginOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [validatedReceiptRequest, setValidatedReceiptRequest] = useState<LoanRequest | null>(null);

  // Sync state & LocalStorage persistence
  useEffect(() => {
    saveUserSessionMode(sessionMode);
  }, [sessionMode]);

  useEffect(() => {
    saveActiveStudentId(activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  useEffect(() => {
    saveCopies(copies);
  }, [copies]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveLoans(loans);
  }, [loans]);

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    saveInquiries(inquiries);
  }, [inquiries]);

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Dynamic automatic check for loan due date reminders (3 days, 1 day, today, overdue)
  useEffect(() => {
    const { updatedNotifications, newCount } = generateLoanDeadlineNotifications(
      loans,
      books,
      notifications
    );
    if (newCount > 0) {
      setNotifications(updatedNotifications);
    }
  }, [loans, books]);

  // Current connected student (if any)
  const currentStudent = activeStudentId ? students.find(s => s.id === activeStudentId) || null : null;

  const overdueCount = loans.filter(l => !l.returnDate && l.status === 'overdue').length;

  // Calculs stricts de la règle de gestion : Maximum 3 emprunts et demandes en attente
  const MAX_LOAN_LIMIT = 3;
  const studentQuotaMessage =
    "Vous avez atteint la limite maximale de 3 emprunts. Veuillez retourner un livre ou attendre le traitement de vos demandes avant d'effectuer une nouvelle demande.";

  // 1. Livres actuellement empruntés (prêts actifs non retournés) pour l'étudiant connecté
  const activeStudentLoans = currentStudent
    ? loans.filter(l => l.studentId === currentStudent.id && !l.returnDate)
    : [];
  const activeLoanCount = activeStudentLoans.length;

  // 2. Demandes d'emprunt en attente pour l'étudiant connecté
  const pendingStudentRequests = currentStudent
    ? requests.filter(r => r.studentId === currentStudent.id && r.status === 'pending')
    : [];
  const pendingRequestCount = pendingStudentRequests.length;

  // 3. Total cumulé réel
  const studentTotalEngaged = activeLoanCount + pendingRequestCount;
  const isStudentQuotaReached = studentTotalEngaged >= MAX_LOAN_LIMIT;

  // Notification helpers
  const activeRecipientId =
    sessionMode === 'etudiant' && currentStudent
      ? currentStudent.id
      : sessionMode === 'gerant'
      ? 'gerant'
      : 'invite';

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.recipientId === activeRecipientId || n.recipientId === 'all' ? { ...n, isRead: true } : n
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev =>
      prev.filter(n => n.recipientId !== activeRecipientId && n.recipientId !== 'all')
    );
  };

  // Add activity log helper
  const addActivity = (type: ActivityLog['type'], description: string) => {
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: `${CURRENT_DATE} 11:30`,
      type,
      description,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Emprunt express en 1 clic (sans panier intermédiaire)
  const handleExpressBorrow = (book: Book, copy: BookCopy) => {
    if (!currentStudent) {
      setIsStudentLoginOpen(true);
      return;
    }

    if (studentTotalEngaged >= MAX_LOAN_LIMIT) {
      alert(studentQuotaMessage);
      return;
    }

    const liveCopy = copies.find(c => c.id === copy.id);
    if (!liveCopy || liveCopy.status !== 'disponible') {
      alert("Cet exemplaire n'est plus disponible actuellement.");
      return;
    }

    const newRequestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const reservationReceiptNum = `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: LoanRequest = {
      id: newRequestId,
      receiptNumber: reservationReceiptNum,
      copyId: liveCopy.id,
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      department: book.department,
      shelfLocation: liveCopy.shelfLocation,
      copyNumber: liveCopy.copyNumber,
      qrCode: liveCopy.qrCode,
      studentId: currentStudent.id,
      studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
      studentInstitutionalId: currentStudent.institutionalId,
      requestDate: CURRENT_DATE,
      requestTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    const managerNotif = createNotification(
      'gerant',
      "Nouvelle demande d'emprunt",
      `Nouvelle demande d'emprunt soumise par ${currentStudent.firstName} ${currentStudent.lastName} pour « ${book.title} » (Exemplaire n°${liveCopy.copyNumber}).`,
      'request_created',
      newRequestId,
      book.title,
      liveCopy.copyNumber,
      `${currentStudent.firstName} ${currentStudent.lastName}`
    );

    setRequests(prev => [newRequest, ...prev]);
    setNotifications(prev => [managerNotif, ...prev]);
    setCopies(prev =>
      prev.map(c => (c.id === liveCopy.id ? { ...c, status: 'emprunte' } : c))
    );

    setBookForDetail(null);
    setValidatedReceiptRequest(newRequest);

    addActivity(
      'loan',
      `Demande express enregistrée : « ${book.title} » (Exemplaire n°${liveCopy.copyNumber}) par ${currentStudent.firstName} ${currentStudent.lastName} (${currentStudent.institutionalId}). Total engagé: ${studentTotalEngaged + 1}/${MAX_LOAN_LIMIT}.`
    );
  };

  // Annuler une demande en attente
  const handleCancelRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req || req.status !== 'pending') return;

    setRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'cancelled' } : r)));

    setCopies(prev =>
      prev.map(c => (c.id === req.copyId ? { ...c, status: 'disponible', currentLoanId: null } : c))
    );

    addActivity(
      'return',
      `Demande d'emprunt annulée pour « ${req.bookTitle} » (Exemplaire n°${req.copyNumber}). Quota étudiant libéré.`
    );
  };

  // Confirmer le retrait physique et l'emprunt (action gérant / scan)
  const handleConfirmPhysicalPickup = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req || req.status !== 'pending') return;

    const today = new Date(CURRENT_DATE);
    const dueObj = new Date(today);
    dueObj.setDate(dueObj.getDate() + 21);
    const dueDateStr = dueObj.toISOString().slice(0, 10);

    const newLoan: Loan = {
      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requestId: req.id,
      copyId: req.copyId,
      bookId: req.bookId,
      copyNumber: req.copyNumber,
      qrCode: req.qrCode,
      studentId: req.studentId,
      borrowDate: CURRENT_DATE,
      dueDate: dueDateStr,
      returnDate: null,
      status: 'active',
      notes: `Remise physique confirmée par le bibliothécaire suite à la réservation n°${req.id}.`,
      renewalCount: 0,
    };

    setRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'approved', loanId: newLoan.id } : r)));
    setLoans(prev => [newLoan, ...prev]);

    setCopies(prev =>
      prev.map(c => (c.id === req.copyId ? { ...c, status: 'emprunte', currentLoanId: newLoan.id } : c))
    );

    // Event Notification for Student: Emprunt confirmé
    const studentNotif = createNotification(
      req.studentId,
      "Emprunt confirmé",
      `Votre retrait physique a été confirmé par le bibliothécaire pour « ${req.bookTitle} ». Emprunt confirmé (Retour prévu le ${dueDateStr}).`,
      'request_accepted',
      newLoan.id,
      req.bookTitle,
      req.copyNumber
    );

    setNotifications(prev => [studentNotif, ...prev]);

    addActivity(
      'loan',
      `Remise physique confirmée : Emprunt confirmé pour ${req.studentName} sur « ${req.bookTitle} » (Exemplaire n°${req.copyNumber}). Date remise: ${CURRENT_DATE}, Date retour: ${dueDateStr}.`
    );
  };

  const handleApproveRequest = (requestId: string) => {
    handleConfirmPhysicalPickup(requestId);
  };

  // Rejeter une demande (action gérant)
  const handleRejectRequest = (requestId: string, reason?: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req || req.status !== 'pending') return;

    setRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' } : r)));

    setCopies(prev =>
      prev.map(c => (c.id === req.copyId ? { ...c, status: 'disponible', currentLoanId: null } : c))
    );

    // Event Notification for Student: Required exact text:
    // « Votre demande d'emprunt a été refusée. Consultez votre espace pour plus d'informations. »
    const studentNotif = createNotification(
      req.studentId,
      "Demande d'emprunt refusée",
      "Votre demande d'emprunt a été refusée. Consultez votre espace pour plus d'informations.",
      'request_rejected',
      req.id,
      req.bookTitle,
      req.copyNumber
    );

    setNotifications(prev => [studentNotif, ...prev]);

    addActivity(
      'return',
      `Demande d'emprunt refusée pour « ${req.bookTitle} » (${req.studentName}). Exemplaire n°${req.copyNumber} remis en rayon.`
    );
  };

  // Traitement en masse : Validation groupée avec vérification séquentielle anti-conflits
  const handleBatchApproveRequests = (requestIds: string[]): BatchProcessingResult => {
    const today = new Date(CURRENT_DATE);
    const dueObj = new Date(today);
    dueObj.setDate(dueObj.getDate() + 21);
    const dueDateStr = dueObj.toISOString().slice(0, 10);

    const newLoansToCreate: Loan[] = [];
    const newNotificationsToCreate: AppNotification[] = [];
    const approvedRequestIds = new Set<string>();
    const usedCopyIds = new Set<string>();

    // Initialiser les copies actuellement indisponibles
    for (const copy of copies) {
      if (copy.status !== 'disponible') {
        usedCopyIds.add(copy.id);
      }
    }

    // Suivi dynamique des quotas par étudiant au cours de la boucle séquentielle
    const dynamicStudentLoansCount = new Map<string, number>();
    for (const student of students) {
      const currentActive = loans.filter(l => l.studentId === student.id && !l.returnDate && l.status !== 'returned').length;
      dynamicStudentLoansCount.set(student.id, currentActive);
    }

    const blockedDetails: BatchProcessingResult['blockedDetails'] = [];

    // Vérification séquentielle ligne par ligne (anti-conflits stricte)
    for (const reqId of requestIds) {
      const req = requests.find(r => r.id === reqId);
      if (!req || req.status !== 'pending') continue;

      const student = students.find(s => s.id === req.studentId);
      const studentEmail = student?.email || `${req.studentName.toLowerCase().replace(/\s+/g, '.')}@usmba.ac.ma`;

      // 1. Contrôle de l'exemplaire : déjà attribué à une demande antérieure du lot ou indisponible
      if (usedCopyIds.has(req.copyId)) {
        blockedDetails.push({
          requestId: req.id,
          studentName: req.studentName,
          studentEmail,
          bookTitle: req.bookTitle,
          copyNumber: req.copyNumber,
          reason: "Exemplaire déjà attribué à une autre demande ou indisponible en rayon",
        });
        continue;
      }

      // 2. Contrôle du quota : l'étudiant a déjà 3 emprunts ou atteint son plafond au cours du lot
      const currentStudentCount = dynamicStudentLoansCount.get(req.studentId) || 0;
      if (currentStudentCount >= 3) {
        blockedDetails.push({
          requestId: req.id,
          studentName: req.studentName,
          studentEmail,
          bookTitle: req.bookTitle,
          copyNumber: req.copyNumber,
          reason: "Plafond atteint : l'étudiant a déjà 3 emprunts en cours (règle max 3)",
        });
        continue;
      }

      // Demande validée avec succès
      usedCopyIds.add(req.copyId);
      dynamicStudentLoansCount.set(req.studentId, currentStudentCount + 1);
      approvedRequestIds.add(req.id);

      const newLoanId = `l-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newLoan: Loan = {
        id: newLoanId,
        receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        requestId: req.id,
        copyId: req.copyId,
        bookId: req.bookId,
        copyNumber: req.copyNumber,
        qrCode: req.qrCode,
        studentId: req.studentId,
        borrowDate: CURRENT_DATE,
        dueDate: dueDateStr,
        returnDate: null,
        status: 'active',
        notes: `Emprunt confirmé par validation groupée.`,
        renewalCount: 0,
      };

      newLoansToCreate.push(newLoan);

      // Notification persistante immédiate pour l'étudiant
      newNotificationsToCreate.push(
        createNotification(
          req.studentId,
          "Emprunt confirmé",
          `Votre demande pour « ${req.bookTitle} » (Exemplaire n°${req.copyNumber}) a été validée. Emprunt confirmé (Date retour prévue : ${dueDateStr}).`,
          'request_accepted',
          newLoan.id,
          req.bookTitle,
          req.copyNumber
        )
      );
    }

    // Mise à jour atomique des états
    if (approvedRequestIds.size > 0) {
      setRequests(prev =>
        prev.map(r => {
          if (approvedRequestIds.has(r.id)) {
            const correspondingLoan = newLoansToCreate.find(l => l.requestId === r.id);
            return { ...r, status: 'approved', loanId: correspondingLoan?.id };
          }
          return r;
        })
      );

      setLoans(prev => [...newLoansToCreate, ...prev]);

      setCopies(prev =>
        prev.map(c => {
          const correspondingLoan = newLoansToCreate.find(l => l.copyId === c.id);
          if (correspondingLoan) {
            return { ...c, status: 'emprunte', currentLoanId: correspondingLoan.id };
          }
          return c;
        })
      );

      setNotifications(prev => [...newNotificationsToCreate, ...prev]);

      addActivity(
        'loan',
        `Validation groupée : ${approvedRequestIds.size} demande(s) validée(s) avec succès. ${blockedDetails.length} demande(s) bloquée(s) pour conflit.`
      );
    }

    return {
      approvedCount: approvedRequestIds.size,
      blockedCount: blockedDetails.length,
      blockedDetails,
    };
  };

  // Traitement en masse : Refus groupé
  const handleBatchRejectRequests = (requestIds: string[], reason?: string) => {
    const rejectedSet = new Set(requestIds);
    const affectedRequests = requests.filter(r => rejectedSet.has(r.id) && r.status === 'pending');
    if (affectedRequests.length === 0) return;

    const notifsToCreate: AppNotification[] = [];
    const freedCopyIds = new Set<string>();

    for (const req of affectedRequests) {
      freedCopyIds.add(req.copyId);
      notifsToCreate.push(
        createNotification(
          req.studentId,
          "Demande d'emprunt refusée",
          reason || "Votre demande d'emprunt a été refusée. Consultez votre espace pour plus d'informations.",
          'request_rejected',
          req.id,
          req.bookTitle,
          req.copyNumber
        )
      );
    }

    setRequests(prev =>
      prev.map(r => (rejectedSet.has(r.id) && r.status === 'pending' ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    );

    setCopies(prev =>
      prev.map(c => (freedCopyIds.has(c.id) && c.status !== 'en_maintenance' ? { ...c, status: 'disponible', currentLoanId: null } : c))
    );

    setNotifications(prev => [...notifsToCreate, ...prev]);

    addActivity(
      'return',
      `Traitement groupé : ${affectedRequests.length} demande(s) refusée(s). Les exemplaires ont été remis en rayon.`
    );
  };

  // Restitution d'un exemplaire
  const handleReturnCopy = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.returnDate) return;

    const book = books.find(b => b.id === loan.bookId);
    const copy = copies.find(c => c.id === loan.copyId);

    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, returnDate: CURRENT_DATE, status: 'returned' } : l))
    );

    if (copy) {
      setCopies(prev =>
        prev.map(c => (c.id === copy.id ? { ...c, status: 'disponible', currentLoanId: null } : c))
      );
    }

    // Event Notification for Student: Required exact text:
    // « Le retour de votre livre a été confirmé. Merci ! »
    const returnNotif = createNotification(
      loan.studentId,
      "Restitution confirmée",
      "Le retour de votre livre a été confirmé. Merci !",
      'return_confirmed',
      loan.id,
      book?.title,
      loan.copyNumber
    );

    setNotifications(prev => [returnNotif, ...prev]);

    addActivity(
      'return',
      `Restitution immédiate : Exemplaire n°${loan.copyNumber} (${loan.qrCode}) de « ${
        book?.title || 'Document'
      } » retourné et remis en disponibilité.`
    );
  };

  // Relance en masse
  const handleTriggerMassReminder = (loanIds: string[]) => {
    setMassReminderLoanIds(loanIds);
    setIsMassReminderOpen(true);
  };

  const handleConfirmMassReminder = (loanIds: string[]) => {
    setLoans(prev =>
      prev.map(l =>
        loanIds.includes(l.id)
          ? {
              ...l,
              lastReminderSent: CURRENT_DATE,
              remindedCount: (l.remindedCount || 0) + 1,
            }
          : l
      )
    );

    addActivity(
      'mass_reminder',
      `Relance en masse expédiée par e-mail à ${loanIds.length} emprunt(s) en retard.`
    );
  };

  // Limitation des demandes du gérant
  const handleRequestBookInquiry = (bookId: string) => {
    const newInquiry: BookInquiry = {
      bookId,
      inquiryTimestamp: `${CURRENT_DATE} 11:35`,
    };
    setInquiries(prev => [...prev, newInquiry]);

    const targetBook = books.find(b => b.id === bookId);
    const notif = createNotification(
      'gerant',
      "Enquête / Suggestion d'ouvrage",
      `Une demande d'enquête d'ouvrage a été effectuée pour « ${targetBook?.title || 'Ouvrage'} ».`,
      'book_suggested',
      bookId,
      targetBook?.title
    );
    setNotifications(prev => [notif, ...prev]);

    addActivity('inquiry_limit', `Enquête d'ouvrage consultée (${inquiries.length + 1}/3 max autorisées).`);
  };

  // Importation en masse d'étudiants
  const handleImportStudents = (newStudents: StudentMember[]) => {
    setStudents(prev => [...newStudents, ...prev]);
    addActivity(
      'mass_import',
      `Importation en masse réussie : ${newStudents.length} nouveaux étudiants EST enregistrés dans le registre institutionnel.`
    );
  };

  // Connexion de l'étudiant
  const handleConnectStudent = (student: StudentMember) => {
    setActiveStudentId(student.id);
    setSessionMode('etudiant');
  };

  // Connexion du gérant réussie
  const handleConnectManagerSuccess = () => {
    setSessionMode('gerant');
  };

  // Déconnexion -> Retour au mode Invité
  const handleSwitchToGuest = () => {
    setSessionMode('invite');
    setActiveStudentId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Barre supérieure avec bouton cloche 🔔, connexion étudiant et connexion gérant */}
      <AppTopBar
        sessionMode={sessionMode}
        currentStudent={currentStudent}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onOpenManagerLogin={() => {
          if (sessionMode !== 'gerant') {
            setIsManagerLoginOpen(true);
          }
        }}
        onSwitchToGuest={handleSwitchToGuest}
        overdueCount={overdueCount}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onOpenAllNotificationsModal={() => setIsAllNotificationsOpen(true)}
      />

      {/* Main View: Role-Based Display */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sessionMode === 'gerant' ? (
          <ManagerDashboardView
            books={books}
            copies={copies}
            students={students}
            loans={loans}
            requests={requests}
            inquiries={inquiries}
            onReturnCopy={handleReturnCopy}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onBatchApproveRequests={handleBatchApproveRequests}
            onBatchRejectRequests={handleBatchRejectRequests}
            onSendMassReminder={handleTriggerMassReminder}
            onRequestBookInquiry={handleRequestBookInquiry}
            onOpenBookDetail={book => setBookForDetail(book)}
            onOpenMassImportModal={() => setIsMassImportOpen(true)}
          />
        ) : (
          <StudentPortalView
            books={books}
            copies={copies}
            loans={loans}
            requests={requests}
            currentStudent={currentStudent}
            onExpressBorrow={handleExpressBorrow}
            onCancelRequest={handleCancelRequest}
            onReturnCopy={handleReturnCopy}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Libris EST Fès</span>
            <span aria-hidden="true">·</span>
            <span>Système de Gestion de Bibliothèque Universitaire (USMBA)</span>
          </div>
          <div className="text-stone-400 font-mono text-[11px]">
            {copies.length} exemplaires physiques · Notifications actives · Mode: {sessionMode.toUpperCase()}
          </div>
        </div>
      </footer>

      {/* Modal Consultation Rapide & Emprunt Express */}
      <StudentBookModal
        book={bookForDetail}
        copies={copies}
        isOpen={!!bookForDetail}
        onClose={() => setBookForDetail(null)}
        onExpressBorrow={handleExpressBorrow}
        isStudentConnected={!!currentStudent}
        onRequireLogin={() => setIsStudentLoginOpen(true)}
        canBorrow={!isStudentQuotaReached}
        borrowBlockReason={isStudentQuotaReached ? studentQuotaMessage : undefined}
        studentTotalEngaged={studentTotalEngaged}
        maxQuota={MAX_LOAN_LIMIT}
      />

      {/* Modal Envoi de Relance en Masse */}
      <MassReminderModal
        isOpen={isMassReminderOpen}
        onClose={() => setIsMassReminderOpen(false)}
        selectedLoans={loans.filter(l => massReminderLoanIds.includes(l.id))}
        books={books}
        copies={copies}
        students={students}
        onConfirmSend={handleConfirmMassReminder}
      />

      {/* Modal Saisie en Masse & Inscriptions */}
      <MassImportModal
        isOpen={isMassImportOpen}
        onClose={() => setIsMassImportOpen(false)}
        onImportStudents={handleImportStudents}
        existingCount={students.length}
      />

      {/* Modal Connexion Étudiant USMBA avec Google OAuth & Démonstration */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        students={students}
        onConnectStudent={handleConnectStudent}
        onConnectManager={handleConnectManagerSuccess}
        onRegisterStudent={newStudent => {
          setStudents(prev => [newStudent, ...prev]);
          addActivity(
            'mass_import',
            `Nouvel étudiant inscrit : ${newStudent.firstName} ${newStudent.lastName} (${newStudent.institutionalId}).`
          );
        }}
      />

      {/* Modal Connexion Espace Gérant */}
      <ManagerLoginModal
        isOpen={isManagerLoginOpen}
        onClose={() => setIsManagerLoginOpen(false)}
        onSuccess={handleConnectManagerSuccess}
      />

      {/* Modal Toutes les Notifications (Historique complet) */}
      <NotificationsModal
        isOpen={isAllNotificationsOpen}
        onClose={() => setIsAllNotificationsOpen(false)}
        notifications={notifications}
        currentUserId={activeRecipientId}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAllNotifications={handleClearAllNotifications}
      />

      {/* Modal Reçu officiel pour téléchargement après validation d'un emprunt */}
      <LoanReceiptModal
        isOpen={!!validatedReceiptRequest}
        onClose={() => setValidatedReceiptRequest(null)}
        request={validatedReceiptRequest}
        book={validatedReceiptRequest ? books.find(b => b.id === validatedReceiptRequest.bookId) || null : null}
        student={currentStudent}
      />
    </div>
  );
}
