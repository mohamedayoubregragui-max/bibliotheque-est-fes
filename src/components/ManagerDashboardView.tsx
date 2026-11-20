import React, { useState } from 'react';
import { Book, BookCopy, StudentMember, Loan, BookInquiry, LoanRequest } from '../types/library';
import {
  AlertTriangle,
  RotateCcw,
  Mail,
  CheckSquare,
  Square,
  Users,
  Search,
  BookOpen,
  QrCode,
  Layers,
  ChevronRight,
  Send,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';
import { calculateDaysDifference, CURRENT_DATE } from '../utils/storage';
import { BookCoverBadge } from './BookCoverBadge';
import { ManagerBatchRequestsTable, BatchProcessingResult } from './ManagerBatchRequestsTable';

interface ManagerDashboardViewProps {
  books: Book[];
  copies: BookCopy[];
  students: StudentMember[];
  loans: Loan[];
  requests: LoanRequest[];
  inquiries: BookInquiry[];
  onReturnCopy: (loanId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason?: string) => void;
  onBatchApproveRequests: (requestIds: string[]) => BatchProcessingResult;
  onBatchRejectRequests: (requestIds: string[], reason?: string) => void;
  onSendMassReminder: (loanIds: string[]) => void;
  onRequestBookInquiry: (bookId: string) => void;
  onOpenBookDetail: (book: Book) => void;
  onOpenMassImportModal: () => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  books,
  copies,
  students,
  loans,
  requests,
  inquiries,
  onReturnCopy,
  onApproveRequest,
  onRejectRequest,
  onBatchApproveRequests,
  onBatchRejectRequests,
  onSendMassReminder,
  onRequestBookInquiry,
  onOpenBookDetail,
  onOpenMassImportModal,
}) => {
  // Checkbox selection state for loans/overdues
  const [selectedLoanIds, setSelectedLoanIds] = useState<string[]>([]);
  const [filterTab, setFilterTab] = useState<'overdue_only' | 'all_active'>('overdue_only');
  const [selectedInquiryBookId, setSelectedInquiryBookId] = useState<string>('');
  const [inquiryResult, setInquiryResult] = useState<{ book: Book; activeStudents: StudentMember[] } | null>(null);

  // Maps
  const bookMap = new Map(books.map(b => [b.id, b]));
  const copyMap = new Map(copies.map(c => [c.id, c]));
  const studentMap = new Map(students.map(s => [s.id, s]));

  const activeLoans = loans.filter(l => !l.returnDate);
  const overdueLoans = activeLoans.filter(l => l.status === 'overdue');
  const displayedLoans = filterTab === 'overdue_only' ? overdueLoans : activeLoans;
  const pendingRequests = requests.filter(r => r.status === 'pending');

  // Mass selection helpers
  const isAllChecked = displayedLoans.length > 0 && displayedLoans.every(l => selectedLoanIds.includes(l.id));

  const handleToggleCheckAll = () => {
    if (isAllChecked) {
      setSelectedLoanIds([]);
    } else {
      setSelectedLoanIds(displayedLoans.map(l => l.id));
    }
  };

  const handleToggleCheckLoan = (id: string) => {
    setSelectedLoanIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Inquiry Quota (Max 3 manual inquiries)
  const MAX_INQUIRIES = 3;
  const remainingInquiries = Math.max(0, MAX_INQUIRIES - inquiries.length);

  const handleExecuteInquiry = () => {
    if (!selectedInquiryBookId) return;
    if (remainingInquiries <= 0) {
      alert("Limite de 3 demandes manuelles atteinte pour cette session de contrôle.");
      return;
    }

    const targetBook = bookMap.get(selectedInquiryBookId);
    if (!targetBook) return;

    // Find all active loans for this book
    const relatedLoans = activeLoans.filter(l => l.bookId === targetBook.id);
    const activeBorrowers = relatedLoans
      .map(l => studentMap.get(l.studentId))
      .filter((s): s is StudentMember => !!s);

    setInquiryResult({
      book: targetBook,
      activeStudents: activeBorrowers,
    });

    onRequestBookInquiry(targetBook.id);
  };

  // KPI Calculations
  const totalCopiesCount = copies.length;
  const availableCopiesCount = copies.filter(c => c.status === 'disponible').length;
  const borrowedCopiesCount = copies.filter(c => c.status === 'emprunte').length;
  const availabilityRate = totalCopiesCount > 0 ? Math.round((availableCopiesCount / totalCopiesCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Visual Header Strip with EST Branding */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide">
            <span>Administration Centrale de la Bibliothèque EST Fès</span>
            <span aria-hidden="true">·</span>
            <span>Système de Suivi Visuel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tableau de Bord du Gérant & Pilotage des Flux
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Surveillance graphique des retards de restitution, contrôle d'inventaire par exemplaire physique (QR code) et actions de relance en masse.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenMassImportModal}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Saisie en Masse & Inscriptions</span>
          </button>
        </div>
      </div>

      {/* Visual KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Exemplaires Physiques */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Parc des Exemplaires EST</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalCopiesCount}</span>
            <span className="text-xs text-stone-500">unités numérotées</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-stone-800 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-stone-500">
            Liés chacun à un code-barres et QR code unique
          </p>
        </div>

        {/* Disponibilité immédiate */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Exemplaires en Rayon</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">{availableCopiesCount}</span>
            <span className="text-xs text-stone-500">disponibles ({availabilityRate}%)</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${availabilityRate}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">
            Retour immédiat en disponibilité dès restitution
          </p>
        </div>

        {/* Retards Critiques avec code couleur spécifique */}
        <div className={`p-5 rounded-xl border shadow-2xs space-y-2 ${
          overdueLoans.length > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={overdueLoans.length > 0 ? 'text-rose-900' : 'text-stone-500'}>
              Retards de Restitution
            </span>
            <AlertTriangle className={`w-4 h-4 ${overdueLoans.length > 0 ? 'text-rose-600' : 'text-stone-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              overdueLoans.length > 0 ? 'text-rose-700' : 'text-stone-900'
            }`}>
              {overdueLoans.length}
            </span>
            <span className="text-xs text-stone-500">en dépassement</span>
          </div>
          <div className="w-full h-1.5 bg-rose-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full"
              style={{ width: `${Math.min(100, (overdueLoans.length / (activeLoans.length || 1)) * 100)}%` }}
            />
          </div>
          <p className={`text-[11px] ${overdueLoans.length > 0 ? 'text-rose-700 font-medium' : 'text-stone-500'}`}>
            Code couleur Alerte Rouge : relance requise
          </p>
        </div>

        {/* Étudiants EST Inscrits */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Étudiants EST Fès</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{students.length}</span>
            <span className="text-xs text-stone-500">identifiants USMBA</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-stone-500">
            Filières DUT & Licences Professionnelles
          </p>
        </div>
      </div>

      {/* Limitation des demandes : Enquête manuelle limitée à max 3 demandes */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Contrôle & Décompte des Étudiants prenant un Ouvrage</span>
            </h2>
            <p className="text-xs text-stone-500">
              Règle métier UML : le gérant peut demander le nombre d'élèves empruntant un ouvrage, <strong>limité à 3 demandes manuelles</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="text-stone-500">Quota restant :</span>
            <span className={`font-bold ${remainingInquiries > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {remainingInquiries} / {MAX_INQUIRIES} demandes
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedInquiryBookId}
            onChange={e => setSelectedInquiryBookId(e.target.value)}
            disabled={remainingInquiries <= 0}
            className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50"
          >
            <option value="">-- Sélectionner un ouvrage pour inspecter les emprunteurs --</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.department})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExecuteInquiry}
            disabled={!selectedInquiryBookId || remainingInquiries <= 0}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shrink-0"
          >
            Lancer l'enquête ({remainingInquiries} restante{remainingInquiries > 1 ? 's' : ''})
          </button>
        </div>

        {/* Affichage du résultat de la demande */}
        {inquiryResult && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-amber-950">
                Ouvrage audité : « {inquiryResult.book.title} »
              </span>
              <span className="font-mono text-amber-900 font-bold">
                {inquiryResult.activeStudents.length} étudiant(s) détienne(nt) actuellement un exemplaire
              </span>
            </div>

            {inquiryResult.activeStudents.length === 0 ? (
              <p className="text-stone-500 italic">Aucun élève n'a d'exemplaire emprunté pour cet ouvrage en ce moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {inquiryResult.activeStudents.map(st => (
                  <div key={st.id} className="p-2.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-900">{st.firstName} {st.lastName}</p>
                      <p className="text-[11px] font-mono text-stone-500">{st.institutionalId} · {st.sector}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                      {st.studyYear}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Centralisée : Tableau de Gestion en Masse & Anti-Conflits des Demandes */}
      <ManagerBatchRequestsTable
        requests={requests}
        copies={copies}
        loans={loans}
        students={students}
        books={books}
        onApproveRequest={onApproveRequest}
        onRejectRequest={onRejectRequest}
        onBatchApproveRequests={onBatchApproveRequests}
        onBatchRejectRequests={onBatchRejectRequests}
      />

      {/* Main Section: Registre des Emprunts & Relance des Retards avec Saisie en Masse */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs space-y-0">
        {/* Control Header Strip */}
        <div className="p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/60">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Gestion des Emprunts & Relance des Retards</span>
              {overdueLoans.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                  {overdueLoans.length} retard(s) critique(s)
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Sélectionnez des lignes individuellement ou utilisez "Cocher tout" pour notifier les retardataires en masse.
            </p>
          </div>

          {/* Filter segment */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-stone-200/70 rounded-lg text-xs">
              <button
                onClick={() => setFilterTab('overdue_only')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                  filterTab === 'overdue_only'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Retards uniquement ({overdueLoans.length})
              </button>
              <button
                onClick={() => setFilterTab('all_active')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  filterTab === 'all_active'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Tous les prêts en cours ({activeLoans.length})
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar when items selected */}
        <div className="px-5 py-3 bg-stone-100/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleCheckAll}
              className="flex items-center gap-2 font-semibold text-stone-800 hover:text-stone-950 transition-colors"
            >
              {isAllChecked ? (
                <CheckSquare className="w-4 h-4 text-amber-700" />
              ) : (
                <Square className="w-4 h-4 text-stone-400" />
              )}
              <span>{isAllChecked ? 'Décocher tout' : 'Cocher tout'}</span>
            </button>

            <span className="text-stone-400">|</span>

            <span className="text-stone-600 font-medium font-mono tabular-nums">
              {selectedLoanIds.length} sélectionné(s) sur {displayedLoans.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedLoanIds.length === 0}
              onClick={() => {
                onSendMassReminder(selectedLoanIds);
                setSelectedLoanIds([]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer e-mail de relance en masse ({selectedLoanIds.length})</span>
            </button>
          </div>
        </div>

        {/* Table of loans */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-10 text-center">
                  <span className="sr-only">Sélectionner</span>
                </th>
                <th className="py-3 px-4">Ouvrage & Détails</th>
                <th className="py-3 px-4">Exemplaire physique</th>
                <th className="py-3 px-4">Étudiant USMBA (EST)</th>
                <th className="py-3 px-4">Échéance & Retard</th>
                <th className="py-3 px-4 text-right">Action immédiate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Aucun prêt ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                displayedLoans.map(loan => {
                  const book = bookMap.get(loan.bookId);
                  const copy = copyMap.get(loan.copyId);
                  const student = studentMap.get(loan.studentId);
                  const isOverdue = loan.status === 'overdue';
                  const daysDiff = calculateDaysDifference(loan.dueDate, CURRENT_DATE);
                  const isChecked = selectedLoanIds.includes(loan.id);

                  return (
                    <tr
                      key={loan.id}
                      className={`transition-colors ${
                        isOverdue
                          ? 'bg-rose-50/40 hover:bg-rose-50/80'
                          : 'hover:bg-stone-50/70'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCheckLoan(loan.id)}
                          className="text-stone-400 hover:text-stone-900 transition-colors"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-700" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-300" />
                          )}
                        </button>
                      </td>

                      {/* Nom de l'ouvrage + Couverture + Bouton Plus de détails */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {book && (
                            <BookCoverBadge
                              category={book.category}
                              department={book.department}
                              title={book.title}
                              size="sm"
                              className="hidden sm:flex"
                            />
                          )}
                          <div className="space-y-1 min-w-0">
                            <div className="font-bold text-stone-900 truncate max-w-xs">{book?.title || 'Document inconnu'}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-stone-500 font-mono">ISBN: {book?.isbn}</span>
                              {book && (
                                <button
                                  type="button"
                                  onClick={() => onOpenBookDetail(book)}
                                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline flex items-center gap-0.5"
                                >
                                  <span>Plus de détails</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Exemplaire précis */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 font-mono">
                          <span className="font-semibold text-stone-900 block text-xs">
                            Exemplaire n°{loan.copyNumber}
                          </span>
                          <span className="text-[11px] text-stone-600 flex items-center gap-1">
                            <QrCode className="w-3 h-3 text-stone-400" />
                            {loan.qrCode}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {copy?.shelfLocation || book?.shelfLocation}
                          </span>
                        </div>
                      </td>

                      {/* Étudiant USMBA */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-stone-900 block">
                            {student ? `${student.firstName} ${student.lastName}` : 'Étudiant inconnu'}
                          </span>
                          <span className="font-mono text-[11px] text-amber-800 block">
                            {student?.institutionalId}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {student?.sector} ({student?.email})
                          </span>
                        </div>
                      </td>

                      {/* Échéance & Retard (Code couleur spécifique) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs tabular-nums text-stone-800">
                            Prêté le {loan.borrowDate}
                          </span>
                          <div className="flex items-center gap-1">
                            {isOverdue ? (
                              <span className="font-mono text-xs font-bold text-rose-700 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                Échu le {loan.dueDate} ({Math.abs(daysDiff)} j de retard)
                              </span>
                            ) : (
                              <span className="font-mono text-xs text-stone-600">
                                Échéance : {loan.dueDate} (dans {daysDiff} j)
                              </span>
                            )}
                          </div>
                          {loan.lastReminderSent && (
                            <span className="text-[10px] text-stone-400 font-mono block">
                              Dernière relance : {loan.lastReminderSent}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Retour immédiat */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onReturnCopy(loan.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1"
                          title="Enregistrer la restitution de cet exemplaire précis"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                          <span>Restituer</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
