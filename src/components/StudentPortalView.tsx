import React, { useState } from 'react';
import { Book, BookCopy, StudentMember, Loan, LoanRequest } from '../types/library';
import { Search, BookOpen, CheckCircle, AlertCircle, Bookmark, Sparkles, MapPin, ChevronRight, LogIn, Clock, X, History, Download } from 'lucide-react';
import { StudentBookModal } from './StudentBookModal';
import { BookCoverBadge } from './BookCoverBadge';
import { LoanReceiptModal } from './LoanReceiptModal';

interface StudentPortalViewProps {
  books: Book[];
  copies: BookCopy[];
  loans: Loan[];
  requests: LoanRequest[];
  currentStudent: StudentMember | null; // null si invité
  onExpressBorrow: (book: Book, copy: BookCopy) => void;
  onCancelRequest: (requestId: string) => void;
  onReturnCopy: (loanId: string) => void;
  onOpenStudentLogin: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  books,
  copies,
  loans,
  requests,
  currentStudent,
  onExpressBorrow,
  onCancelRequest,
  onReturnCopy,
  onOpenStudentLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Tous');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available_only'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedLoanForReceipt, setSelectedLoanForReceipt] = useState<Loan | null>(null);
  const [selectedRequestForReceipt, setSelectedRequestForReceipt] = useState<LoanRequest | null>(null);

  const isGuest = !currentStudent;

  // Règle principale : maximum 3 emprunts par étudiant (emprunts actifs + demandes en attente)
  const MAX_LIMIT = 3;

  // 1. Livres actuellement empruntés (prêts actifs non retournés)
  const activeStudentLoans = currentStudent ? loans.filter(l => l.studentId === currentStudent.id && !l.returnDate) : [];
  const activeLoanCount = activeStudentLoans.length;

  // 1b. Historique des anciens emprunts retournés
  const returnedStudentLoans = currentStudent ? loans.filter(l => l.studentId === currentStudent.id && !!l.returnDate) : [];

  // 2. Demandes d'emprunt en attente
  const pendingStudentRequests = currentStudent ? requests.filter(r => r.studentId === currentStudent.id && r.status === 'pending') : [];
  const pendingRequestCount = pendingStudentRequests.length;

  // 3. Total cumulé réel
  const studentTotalEngaged = activeLoanCount + pendingRequestCount;
  const isLimitReached = studentTotalEngaged >= MAX_LIMIT;

  const quotaReachedMessage = "Vous avez atteint la limite maximale de 3 emprunts. Veuillez retourner un livre ou attendre le traitement de vos demandes avant d'effectuer une nouvelle demande.";

  // Book copies availability map
  const getBookAvailability = (bookId: string) => {
    const bookCopies = copies.filter(c => c.bookId === bookId);
    const availableCopies = bookCopies.filter(c => c.status === 'disponible');
    return {
      total: bookCopies.length,
      available: availableCopies.length,
      isAvailable: availableCopies.length > 0,
    };
  };

  const departments = [
    'Tous',
    'Génie Informatique',
    'Génie Électrique',
    'Génie Industriel',
    'Management & Gestion',
    'Sciences Fondamentales'
  ];

  // Filtering
  const filteredBooks = books.filter(b => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.isbn.includes(query) ||
      b.category.toLowerCase().includes(query);

    const matchesDept = selectedDepartment === 'Tous' || b.department === selectedDepartment;

    const avail = getBookAvailability(b.id);
    const matchesAvail = filterAvailability === 'all' || avail.isAvailable;

    return matchesSearch && matchesDept && matchesAvail;
  });

  const suggestedBooks = books.filter(b => b.isSuggested);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      {isGuest ? (
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
              <span>Portail de Consultation Libre · EST Fès</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-300">Mode Invité</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bienvenue à la Bibliothèque Universitaire de l'EST Fès
            </h1>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Consultez le catalogue, sélectionnez un ouvrage et validez votre demande d'emprunt en un clic (maximum 3 emprunts & demandes).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenStudentLogin}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-sm transition-colors text-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter (USMBA)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>Portail Étudiant · EST Fès</span>
              <span aria-hidden="true">·</span>
              <span>Session USMBA Active</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bonjour, {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Consultez le catalogue et empruntez vos exemplaires physiques en 1 clic (limité à <strong>3 emprunts & demandes au maximum</strong>).
            </p>
          </div>

          {/* Student ID Card Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-stone-800/90 border border-stone-700/80 rounded-xl p-3.5 min-w-[260px] text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-stone-700 pb-1.5">
                <span className="text-stone-400 font-medium">Carte d'accès EST</span>
                <span className="font-mono text-emerald-400 text-[10px] font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">ID USMBA :</span>
                <span className="font-mono font-semibold text-white">{currentStudent.institutionalId}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-700/60">
                <span className="text-stone-400">Quota engagé :</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  isLimitReached ? 'bg-rose-900/60 text-rose-300 border border-rose-700' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {studentTotalEngaged} / {MAX_LIMIT} max
                </span>
              </div>
              <div className="text-[10px] text-stone-400 flex justify-between font-mono pt-0.5">
                <span>{activeLoanCount} emprunté(s)</span>
                <span>{pendingRequestCount} en attente</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quota Dashboard & Warning Section for logged in student */}
      {!isGuest && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  État de vos emprunts et demandes
                </h2>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isLimitReached
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {studentTotalEngaged} / {MAX_LIMIT} max
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Règle de gestion EST : un étudiant peut avoir au maximum 3 emprunts et demandes en attente au total.
              </p>
            </div>

            <div className="text-right">
              {isLimitReached ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Limite maximale atteinte (3/3)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{MAX_LIMIT - studentTotalEngaged} place(s) d'emprunt disponible(s)</span>
                </span>
              )}
            </div>
          </div>

          {/* Exact required warning banner when limit is reached */}
          {isLimitReached && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-3 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-900 text-sm">
                  Limite maximale atteinte (3 emprunts)
                </p>
                <p className="leading-relaxed font-medium">
                  Vous avez atteint la limite maximale de 3 emprunts. Veuillez retourner un livre ou attendre le traitement de vos demandes avant d'effectuer une nouvelle demande.
                </p>
              </div>
            </div>
          )}

          {/* 2 Breakdown Cards: Emprunts Actifs & Demandes en Attente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Colonne 1: Livres actuellement empruntés */}
            <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Livres actuellement empruntés
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200 shadow-2xs">
                  {activeLoanCount} livre{activeLoanCount > 1 ? 's' : ''}
                </span>
              </div>

              {activeStudentLoans.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-3 text-center bg-white/60 rounded-lg border border-dashed border-stone-200">
                  Aucun livre actuellement emprunté.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {activeStudentLoans.map(loan => {
                    const book = books.find(b => b.id === loan.bookId);
                    const isOverdue = loan.status === 'overdue';

                    return (
                      <div key={loan.id} className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {book && (
                            <BookCoverBadge
                              category={book.category}
                              department={book.department}
                              title={book.title}
                              coverUrl={book.coverUrl}
                              size="sm"
                            />
                          )}
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h4 className="text-xs font-bold text-stone-900 truncate">{book?.title || 'Document'}</h4>
                            <p className="text-[11px] text-stone-500 font-mono">
                              Exemplaire n°{loan.copyNumber} · {loan.qrCode}
                            </p>
                            <p className={`text-[10px] font-mono font-medium ${isOverdue ? 'text-rose-600 font-bold' : 'text-stone-600'}`}>
                              {isOverdue ? '⚠️ Retard - Échéance :' : 'À rendre avant le :'} {loan.dueDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedLoanForReceipt(loan)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Télécharger votre reçu officiel d'emprunt"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Télécharger le reçu</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onReturnCopy(loan.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                            title="Restituer cet exemplaire au comptoir EST"
                          >
                            Restituer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Colonne 2: Demandes d'emprunt en attente */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Demandes d'emprunt en attente
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {pendingRequestCount} en attente
                </span>
              </div>

              {pendingStudentRequests.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-3 text-center bg-white/60 rounded-lg border border-dashed border-amber-200/80">
                  Aucune demande d'emprunt en attente de traitement.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {pendingStudentRequests.map(req => (
                    <div key={req.id} className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <BookCoverBadge
                          category={req.department}
                          department={req.department}
                          title={req.bookTitle}
                          coverUrl={req.coverUrl}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{req.bookTitle}</h4>
                          <p className="text-[11px] text-stone-500 font-mono">
                            Exemplaire n°{req.copyNumber} · {req.qrCode}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                              En attente de validation
                            </span>
                            <span className="text-stone-400">
                              Demandé le {req.requestDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedRequestForReceipt(req)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Télécharger votre reçu de réservation en ligne"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-800" />
                          <span>Télécharger le reçu</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onCancelRequest(req.id)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                          title="Annuler cette demande d'emprunt et libérer votre quota"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Annuler</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ancien reçus d'emprunts restitués (Historique) */}
          {returnedStudentLoans.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-700">
                <History className="w-4 h-4 text-emerald-800" />
                <span>Historique de mes anciens reçus d'emprunt ({returnedStudentLoans.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {returnedStudentLoans.map(loan => {
                  const book = books.find(b => b.id === loan.bookId);
                  return (
                    <div
                      key={loan.id}
                      className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-bold text-stone-900 truncate">{book?.title || 'Ouvrage'}</p>
                        <p className="text-[10px] text-stone-500 font-mono">Restitué le {loan.returnDate}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedLoanForReceipt(loan)}
                        className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-stone-300 hover:border-emerald-300 font-bold rounded-lg text-[10px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                        title="Télécharger le reçu de restitution"
                      >
                        <Download className="w-3 h-3 text-emerald-800" />
                        <span>Reçu</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Search Zone */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">Recherche au catalogue documentaire EST</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Trouvez vos ouvrages, consultez les exemplaires disponibles et demandez l'emprunt en 1 clic
            </p>
          </div>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par titre de cours, auteur, mot-clé ou ISBN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors shadow-inner"
          />
        </div>

        {/* Department Filters & Availability Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-medium mr-1 shrink-0">Département :</span>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedDepartment === dept
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilterAvailability(prev => prev === 'all' ? 'available_only' : 'all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                filterAvailability === 'available_only'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Uniquement exemplaires disponibles</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Sélection d'ouvrages suggérés */}
      {!searchQuery && selectedDepartment === 'Tous' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">
                Sélection d'ouvrages suggérés pour vos études EST
              </h2>
            </div>
            <span className="text-xs text-stone-500">
              Recommandés par le corps enseignant USMBA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedBooks.map(book => {
              const avail = getBookAvailability(book.id);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Image réelle / Couverture de l'ouvrage */}
                    <BookCoverBadge
                      category={book.category}
                      department={book.department}
                      title={book.title}
                      coverUrl={book.coverUrl}
                      size="md"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                        <span className="truncate max-w-[70%] text-amber-800">{book.department}</span>
                        <span className="font-mono tabular-nums">{book.publishedYear}</span>
                      </div>

                      <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-stone-600 font-medium truncate">{book.author}</p>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed pt-1 border-t border-stone-100">
                      {book.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                    <div>
                      {avail.isAvailable ? (
                        <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                          {avail.available}/{avail.total} dispo.
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700">
                          Indisponible
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Consulter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Résultats de recherche du catalogue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            {searchQuery ? `Résultats de recherche (${filteredBooks.length})` : 'Tous les ouvrages de la bibliothèque'}
          </h2>
          <span className="text-xs text-stone-500">
            Cliquez sur un ouvrage pour accéder aux exemplaires et emprunter en 1 clic
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-600 font-medium">
              Aucun ouvrage ne correspond à votre recherche « {searchQuery} ».
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('Tous');
                setFilterAvailability('all');
              }}
              className="text-xs text-amber-700 font-semibold underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredBooks.map(book => {
              const avail = getBookAvailability(book.id);
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Image réelle / Couverture de l'ouvrage */}
                    <BookCoverBadge
                      category={book.category}
                      department={book.department}
                      title={book.title}
                      coverUrl={book.coverUrl}
                      size="md"
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-medium text-amber-800">{book.department}</span>
                        <span className="font-mono text-stone-400">{book.isbn}</span>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium">{book.author}</p>
                    </div>

                    <div className="text-[11px] text-stone-500 flex items-center gap-1 truncate pt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{book.shelfLocation}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1 border-t border-stone-100">
                      {book.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                    <div>
                      {avail.isAvailable ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-800 font-mono">
                            {avail.available} exemplaire(s) en rayon
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span className="text-xs font-semibold text-rose-700">
                            Exemplaires indisponibles
                          </span>
                        </div>
                      )}
                    </div>

                    {isLimitReached ? (
                      <button
                        type="button"
                        disabled={true}
                        title={quotaReachedMessage}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed border border-stone-200"
                      >
                        Demander un emprunt
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 group-hover:bg-amber-400 group-hover:text-stone-950 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Demander un emprunt</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Consultation Rapide & Emprunt Express en 1 clic */}
      <StudentBookModal
        book={selectedBook}
        copies={copies}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onExpressBorrow={(bk, cp) => {
          setSelectedBook(null);
          onExpressBorrow(bk, cp);
        }}
        isStudentConnected={!isGuest}
        onRequireLogin={onOpenStudentLogin}
        canBorrow={!isLimitReached}
        borrowBlockReason={isLimitReached ? quotaReachedMessage : undefined}
        studentTotalEngaged={studentTotalEngaged}
        maxQuota={MAX_LIMIT}
      />

      {/* Modal Reçu Officiel d'Emprunt Numérique (Image PNG & QR Code) */}
      <LoanReceiptModal
        isOpen={!!selectedLoanForReceipt}
        onClose={() => setSelectedLoanForReceipt(null)}
        loan={selectedLoanForReceipt}
        book={selectedLoanForReceipt ? books.find(b => b.id === selectedLoanForReceipt.bookId) || null : null}
        student={currentStudent}
        copy={selectedLoanForReceipt ? copies.find(c => c.id === selectedLoanForReceipt.copyId) || null : null}
      />

      {/* Modal Reçu de Réservation en Ligne */}
      <LoanReceiptModal
        isOpen={!!selectedRequestForReceipt}
        onClose={() => setSelectedRequestForReceipt(null)}
        request={selectedRequestForReceipt}
        book={selectedRequestForReceipt ? books.find(b => b.id === selectedRequestForReceipt.bookId) || null : null}
        student={currentStudent}
        copy={selectedRequestForReceipt ? copies.find(c => c.id === selectedRequestForReceipt.copyId) || null : null}
      />
    </div>
  );
};
