import React, { useState, useMemo } from 'react';
import { LoanRequest, BookCopy, Loan, StudentMember, Book } from '../types/library';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  User,
  Clock,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Info,
  ShieldCheck,
  X,
  FileCheck,
} from 'lucide-react';
import { BookCoverBadge } from './BookCoverBadge';

export interface BatchProcessingResult {
  approvedCount: number;
  blockedCount: number;
  blockedDetails: {
    requestId: string;
    studentName: string;
    studentEmail: string;
    bookTitle: string;
    copyNumber: number;
    reason: string;
  }[];
}

interface ManagerBatchRequestsTableProps {
  requests: LoanRequest[];
  copies: BookCopy[];
  loans: Loan[];
  students: StudentMember[];
  books: Book[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason?: string) => void;
  onBatchApproveRequests: (requestIds: string[]) => BatchProcessingResult;
  onBatchRejectRequests: (requestIds: string[], reason?: string) => void;
}

export type RequestDiagnosticType =
  | 'eligible' // Prête à valider (vert)
  | 'conflict_duplicate' // Conflit de doublon : plusieurs demandes sur le même exemplaire (orange)
  | 'conflict_quota' // Quota étudiant atteint >= 3 (rouge)
  | 'conflict_unavailable' // Exemplaire déjà indisponible (rouge)
  | 'approved'
  | 'rejected'
  | 'cancelled';

export interface RequestRowDiagnostic {
  type: RequestDiagnosticType;
  label: string;
  detail: string;
  isEligible: boolean;
  hasConflict: boolean;
  activeLoanCount: number;
  copyIsAvailable: boolean;
  competingRequestsCount: number;
}

export const ManagerBatchRequestsTable: React.FC<ManagerBatchRequestsTableProps> = ({
  requests,
  copies,
  loans,
  students,
  books,
  onApproveRequest,
  onRejectRequest,
  onBatchApproveRequests,
  onBatchRejectRequests,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'eligible_only' | 'conflicts_only' | 'pending_only' | 'processed_only'>('pending_only');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Result dialog for batch operations
  const [batchResult, setBatchResult] = useState<BatchProcessingResult | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingIds, setRejectingIds] = useState<string[]>([]);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Fast lookups maps
  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const copyMap = useMemo(() => new Map(copies.map(c => [c.id, c])), [copies]);
  const bookMap = useMemo(() => new Map(books.map(b => [b.id, b])), [books]);

  // Compute active loans per student
  const studentActiveLoansMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const loan of loans) {
      if (!loan.returnDate && loan.status !== 'returned') {
        map.set(loan.studentId, (map.get(loan.studentId) || 0) + 1);
      }
    }
    return map;
  }, [loans]);

  // Compute pending requests count per copy to detect duplicates
  const pendingRequestsPerCopyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const req of requests) {
      if (req.status === 'pending') {
        map.set(req.copyId, (map.get(req.copyId) || 0) + 1);
      }
    }
    return map;
  }, [requests]);

  // Real-time diagnostic calculation for every single request
  const getRequestDiagnostic = (req: LoanRequest): RequestRowDiagnostic => {
    if (req.status === 'approved') {
      return {
        type: 'approved',
        label: 'Validée (Emprunt actif)',
        detail: 'Demande confirmée, exemplaire attribué.',
        isEligible: false,
        hasConflict: false,
        activeLoanCount: studentActiveLoansMap.get(req.studentId) || 0,
        copyIsAvailable: false,
        competingRequestsCount: 0,
      };
    }
    if (req.status === 'rejected') {
      return {
        type: 'rejected',
        label: 'Refusée',
        detail: req.rejectionReason || 'Demande refusée par le bibliothécaire.',
        isEligible: false,
        hasConflict: false,
        activeLoanCount: studentActiveLoansMap.get(req.studentId) || 0,
        copyIsAvailable: true,
        competingRequestsCount: 0,
      };
    }
    if (req.status === 'cancelled') {
      return {
        type: 'cancelled',
        label: 'Annulée',
        detail: "Annulée par l'étudiant.",
        isEligible: false,
        hasConflict: false,
        activeLoanCount: studentActiveLoansMap.get(req.studentId) || 0,
        copyIsAvailable: true,
        competingRequestsCount: 0,
      };
    }

    // Pending checks:
    const activeLoans = studentActiveLoansMap.get(req.studentId) || 0;
    const copy = copyMap.get(req.copyId);
    const copyIsAvailable = copy ? copy.status === 'disponible' : false;
    const competingRequestsCount = (pendingRequestsPerCopyMap.get(req.copyId) || 1) - 1;

    // 1. Check Copy Availability
    if (!copyIsAvailable) {
      return {
        type: 'conflict_unavailable',
        label: 'Exemplaire indisponible',
        detail: "L'exemplaire physique est déjà prêté ou non disponible en rayon.",
        isEligible: false,
        hasConflict: true,
        activeLoanCount: activeLoans,
        copyIsAvailable: false,
        competingRequestsCount,
      };
    }

    // 2. Check Student Quota (Max 3 active loans)
    if (activeLoans >= 3) {
      return {
        type: 'conflict_quota',
        label: 'Quota atteint (3/3)',
        detail: "L'étudiant a déjà 3 emprunts actifs en cours.",
        isEligible: false,
        hasConflict: true,
        activeLoanCount: activeLoans,
        copyIsAvailable: true,
        competingRequestsCount,
      };
    }

    // 3. Check Duplicate Requests for the same physical copy
    if (competingRequestsCount > 0) {
      return {
        type: 'conflict_duplicate',
        label: 'Conflit de doublon',
        detail: `${competingRequestsCount} autre(s) étudiant(s) demandent simultanément cet exemplaire n°${req.copyNumber}. Arbitrage requis.`,
        isEligible: false,
        hasConflict: true,
        activeLoanCount: activeLoans,
        copyIsAvailable: true,
        competingRequestsCount,
      };
    }

    // 4. All good: Eligible
    return {
      type: 'eligible',
      label: 'Prête à valider',
      detail: 'Exemplaire disponible en rayon et quota étudiant valide.',
      isEligible: true,
      hasConflict: false,
      activeLoanCount: activeLoans,
      copyIsAvailable: true,
      competingRequestsCount: 0,
    };
  };

  // Pre-calculate diagnostics for all requests for instant filtering & sorting
  const requestsWithDiagnostic = useMemo(() => {
    return requests.map(req => ({
      req,
      diag: getRequestDiagnostic(req),
      student: studentMap.get(req.studentId),
      book: bookMap.get(req.bookId),
      copy: copyMap.get(req.copyId),
    }));
  }, [requests, studentMap, copyMap, bookMap, studentActiveLoansMap, pendingRequestsPerCopyMap]);

  // Overall counters
  const counters = useMemo(() => {
    let eligible = 0;
    let conflicts = 0;
    let pending = 0;
    let processed = 0;

    for (const item of requestsWithDiagnostic) {
      if (item.req.status === 'pending') {
        pending++;
        if (item.diag.isEligible) eligible++;
        if (item.diag.hasConflict) conflicts++;
      } else {
        processed++;
      }
    }

    return {
      total: requestsWithDiagnostic.length,
      eligible,
      conflicts,
      pending,
      processed,
    };
  }, [requestsWithDiagnostic]);

  // Filtered requests based on search and active tab
  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return requestsWithDiagnostic.filter(({ req, diag, student }) => {
      // Tab filter
      if (activeTab === 'eligible_only') {
        if (req.status !== 'pending' || !diag.isEligible) return false;
      } else if (activeTab === 'conflicts_only') {
        if (req.status !== 'pending' || !diag.hasConflict) return false;
      } else if (activeTab === 'pending_only') {
        if (req.status !== 'pending') return false;
      } else if (activeTab === 'processed_only') {
        if (req.status === 'pending') return false;
      }

      // Search query filter
      if (q) {
        const matchesName = req.studentName.toLowerCase().includes(q);
        const matchesEmail = student?.email.toLowerCase().includes(q) || false;
        const matchesId = req.studentInstitutionalId.toLowerCase().includes(q);
        const matchesTitle = req.bookTitle.toLowerCase().includes(q);
        const matchesAuthor = req.author.toLowerCase().includes(q);
        const matchesQr = req.qrCode.toLowerCase().includes(q);
        const matchesReceipt = req.receiptNumber?.toLowerCase().includes(q) || false;

        if (!matchesName && !matchesEmail && !matchesId && !matchesTitle && !matchesAuthor && !matchesQr && !matchesReceipt) {
          return false;
        }
      }

      return true;
    });
  }, [requestsWithDiagnostic, activeTab, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const paginatedRequests = useMemo(() => {
    if (pageSize >= 500) return filteredRequests;
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

  // Selection helpers
  const filteredPendingEligibleIds = useMemo(() => {
    return filteredRequests
      .filter(item => item.req.status === 'pending' && item.diag.isEligible)
      .map(item => item.req.id);
  }, [filteredRequests]);

  const allFilteredPendingIds = useMemo(() => {
    return filteredRequests
      .filter(item => item.req.status === 'pending')
      .map(item => item.req.id);
  }, [filteredRequests]);

  const isAllFilteredSelected =
    allFilteredPendingIds.length > 0 &&
    allFilteredPendingIds.every(id => selectedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      setSelectedIds(prev => prev.filter(id => !allFilteredPendingIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...allFilteredPendingIds])));
    }
  };

  const handleSelectOnlyEligible = () => {
    setSelectedIds(filteredPendingEligibleIds);
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Selected items breakdown
  const selectedDiagnostics = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    let eligibleCount = 0;
    let conflictCount = 0;

    for (const item of requestsWithDiagnostic) {
      if (selectedSet.has(item.req.id)) {
        if (item.diag.isEligible) eligibleCount++;
        if (item.diag.hasConflict) conflictCount++;
      }
    }

    return {
      total: selectedIds.length,
      eligibleCount,
      conflictCount,
    };
  }, [selectedIds, requestsWithDiagnostic]);

  // Batch actions execution
  const handleExecuteBatchApprove = () => {
    if (selectedIds.length === 0) return;
    const result = onBatchApproveRequests(selectedIds);
    setBatchResult(result);
    // Uncheck approved requests
    setSelectedIds([]);
  };

  const handleOpenBatchReject = () => {
    if (selectedIds.length === 0) return;
    setRejectingIds(selectedIds);
    setRejectionReasonInput('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmBatchReject = () => {
    onBatchRejectRequests(rejectingIds, rejectionReasonInput || 'Refusé lors du traitement par lot.');
    setIsRejectModalOpen(false);
    setSelectedIds(prev => prev.filter(id => !rejectingIds.includes(id)));
    setRejectingIds([]);
  };

  const handleSingleReject = (id: string) => {
    setRejectingIds([id]);
    setRejectionReasonInput('');
    setIsRejectModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs space-y-0">
      {/* 1. Header & Context */}
      <div className="p-5 border-b border-stone-200 bg-linear-to-r from-stone-900 via-stone-850 to-stone-900 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Gestion Centralisée des Demandes d'Emprunt
              </h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-800 text-emerald-300 border border-stone-700">
                Contrôle Anti-Conflits Actif
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              Tableau de traitement en masse conçu pour traiter rapidement de forts volumes (ex: 200 demandes).
              Aucune validation automatique : chaque décision reste sous contrôle humain strict avec vérification séquentielle en temps réel.
            </p>
          </div>

          {/* KPI Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center gap-2">
              <span className="text-[11px] text-stone-400 uppercase font-semibold">Total</span>
              <span className="font-mono text-xs font-bold text-white">{counters.total}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-emerald-300 font-semibold">Prêtes</span>
              <span className="font-mono text-xs font-bold text-emerald-200">{counters.eligible}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-800/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-[11px] text-amber-300 font-semibold">Conflits</span>
              <span className="font-mono text-xs font-bold text-amber-200">{counters.conflicts}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[11px] text-stone-400 font-semibold">En attente</span>
              <span className="font-mono text-xs font-bold text-amber-300">{counters.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters Bar, Search & Quick Selection Buttons */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filtrer par étudiant, e-mail @usmba, livre, code QR..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Selection Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSelectOnlyEligible}
              disabled={counters.eligible === 0}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Cocher d'un clic toutes les demandes prêtes à valider sans conflit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sélectionner les {counters.eligible} éligibles</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSelectAll}
              disabled={allFilteredPendingIds.length === 0}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 disabled:opacity-40 text-stone-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {isAllFilteredSelected ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Désélectionner tout</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-stone-600" />
                  <span>Tout cocher ({allFilteredPendingIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Tabs & Density control */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending_only');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending_only'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200/70 text-stone-600 border border-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>En attente ({counters.pending})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('eligible_only');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'eligible_only'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Éligibles uniquement ({counters.eligible})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('conflicts_only');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'conflicts_only'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Conflits / À vérifier ({counters.conflicts})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200/70 text-stone-600 border border-stone-200'
              }`}
            >
              Toutes ({counters.total})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('processed_only');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'processed_only'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200/70 text-stone-600 border border-stone-200'
              }`}
            >
              Traitées ({counters.processed})
            </button>
          </div>

          {/* Density & pagination selector */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Afficher par :</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs text-stone-700 font-mono focus:outline-none focus:border-stone-400"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>Tout afficher</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Sticky / Floating Bulk Actions Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-30 px-5 py-3 bg-linear-to-r from-emerald-900 via-stone-900 to-stone-900 text-white border-y border-emerald-700/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500 text-stone-950 font-mono font-bold text-xs">
              {selectedDiagnostics.total}
            </span>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{selectedDiagnostics.total} demande(s) sélectionnée(s) pour traitement groupé</span>
              </p>
              <p className="text-[11px] text-stone-300">
                <span className="text-emerald-300 font-semibold">{selectedDiagnostics.eligibleCount} prête(s) à valider</span>
                {selectedDiagnostics.conflictCount > 0 && (
                  <span className="text-amber-300 font-semibold ml-2">
                    · {selectedDiagnostics.conflictCount} avec conflit (vérification séquentielle active)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExecuteBatchApprove}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-950" />
              <span>Accepter la sélection ({selectedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={handleOpenBatchReject}
              className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Refuser la sélection ({selectedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-2 text-stone-400 hover:text-white text-xs underline cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* 4. The Centralized Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/90 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
              {/* Checkbox column */}
              <th className="py-3 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  aria-label="Tout sélectionner"
                  checked={isAllFilteredSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>

              <th className="py-3 px-4">Étudiant (Nom & Quota)</th>
              <th className="py-3 px-4">Livre & Exemplaire demandé</th>
              <th className="py-3 px-3">Date & Heure</th>
              <th className="py-3 px-3">Disponibilité</th>
              <th className="py-3 px-3">Diagnostic & Éligibilité</th>
              <th className="py-3 px-4 text-right">Actions Rapides</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 bg-white">
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400 space-y-2">
                  <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-semibold text-stone-600">Aucune demande ne correspond aux critères sélectionnés.</p>
                  <p className="text-[11px] text-stone-400">
                    Modifiez vos filtres ou effectuez une recherche différente.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedRequests.map(({ req, diag, student }) => {
                const isSelected = selectedIds.includes(req.id);
                const isPending = req.status === 'pending';

                return (
                  <tr
                    key={req.id}
                    className={`transition-colors group hover:bg-stone-50/80 ${
                      isSelected
                        ? 'bg-emerald-50/40'
                        : diag.type === 'conflict_duplicate'
                        ? 'bg-amber-50/20'
                        : diag.type === 'conflict_quota' || diag.type === 'conflict_unavailable'
                        ? 'bg-rose-50/20'
                        : ''
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(req.id)}
                        disabled={!isPending}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                    </td>

                    {/* 2. Étudiant (Nom complet, e-mail @usmba.ac.ma et son quota actif actuel ex: 2/3) */}
                    <td className="py-3 px-4 min-w-[210px]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 group-hover:text-emerald-950">
                            {req.studentName}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              diag.activeLoanCount >= 3
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : diag.activeLoanCount === 2
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                            title={`Quota : ${diag.activeLoanCount} emprunt(s) actif(s) sur 3 autorisés`}
                          >
                            Quota {diag.activeLoanCount}/3
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-500 font-mono">
                          {student?.email || `${req.studentName.toLowerCase().replace(/\s+/g, '.')}@usmba.ac.ma`}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {req.studentInstitutionalId} · {student?.sector || 'EST Fès'}
                        </p>
                      </div>
                    </td>

                    {/* 3. Livre & Exemplaire demandé (Titre + numéro d'exemplaire / QR code) */}
                    <td className="py-3 px-4 min-w-[260px]">
                      <div className="flex items-center gap-2.5">
                        <BookCoverBadge
                          category={req.department}
                          department={req.department}
                          title={req.bookTitle}
                          coverUrl={req.coverUrl}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <h4 className="font-bold text-stone-900 leading-snug line-clamp-1" title={req.bookTitle}>
                            {req.bookTitle}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">{req.author}</p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-stone-600">
                            <span className="px-1.5 py-0.2 rounded bg-stone-100 font-semibold text-stone-800">
                              Exemplaire n°{req.copyNumber}
                            </span>
                            <span className="text-stone-400 truncate">QR: {req.qrCode}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 4. Date & Heure de la demande */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono text-stone-600 text-[11px]">
                        <p className="font-semibold text-stone-800">{req.requestDate}</p>
                        <p className="text-[10px] text-stone-400">
                          {req.requestTime || '10:15'}
                        </p>
                      </div>
                    </td>

                    {/* 5. Disponibilité de l'exemplaire (Badge clair : Disponible ou Déjà emprunté) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {diag.copyIsAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>Disponible</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          <span>Déjà emprunté</span>
                        </span>
                      )}
                    </td>

                    {/* 6. Éligibilité / Diagnostic automatique en temps réel */}
                    <td className="py-3 px-3 min-w-[200px]">
                      {diag.type === 'eligible' && (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Prête à valider</span>
                          </span>
                          <p className="text-[10px] text-emerald-700 leading-tight">
                            Exemplaire en rayon · Quota OK
                          </p>
                        </div>
                      )}

                      {diag.type === 'conflict_duplicate' && (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>Conflit de doublon</span>
                          </span>
                          <p className="text-[10px] text-amber-800 leading-tight font-medium">
                            {diag.detail}
                          </p>
                        </div>
                      )}

                      {diag.type === 'conflict_quota' && (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                            <span>Quota atteint (3/3)</span>
                          </span>
                          <p className="text-[10px] text-rose-700 leading-tight">
                            {diag.detail}
                          </p>
                        </div>
                      )}

                      {diag.type === 'conflict_unavailable' && (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                            <span>Exemplaire indisponible</span>
                          </span>
                          <p className="text-[10px] text-rose-700 leading-tight">
                            {diag.detail}
                          </p>
                        </div>
                      )}

                      {diag.type === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Validée</span>
                        </span>
                      )}

                      {diag.type === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-rose-700 border border-stone-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>Refusée</span>
                        </span>
                      )}

                      {diag.type === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                          <span>Annulée</span>
                        </span>
                      )}
                    </td>

                    {/* 7. Actions rapides individuelles (Accepter / Refuser) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApproveRequest(req.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Accepter et confirmer l'emprunt individuellement"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accepter</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSingleReject(req.id)}
                            className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Refuser cette demande d'emprunt"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Refuser</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 font-mono italic">
                          Traitée
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination Footer */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <div>
          Affichage de <strong className="text-stone-900">{filteredRequests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> à{' '}
          <strong className="text-stone-900">{Math.min(currentPage * pageSize, filteredRequests.length)}</strong> sur{' '}
          <strong className="text-stone-900">{filteredRequests.length}</strong> demandes filtrées ({counters.total} au total)
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              Précédent
            </button>
            <span className="px-3 py-1 font-mono text-stone-700">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-white border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* 6. Batch Processing Result Modal (Anti-Conflict Protection Feedback) */}
      {batchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${
                  batchResult.blockedCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {batchResult.blockedCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Rapport de la Validation Groupée
                  </h3>
                  <p className="text-xs text-stone-500">
                    Contrôle de sécurité séquentiel anti-conflits exécuté
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBatchResult(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Validées avec succès</span>
                <span className="text-2xl font-bold font-mono text-emerald-950">{batchResult.approvedCount}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">Étudiants notifiés immédiatement</span>
              </div>

              <div className={`p-3 rounded-xl border ${
                batchResult.blockedCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}>
                <span className="text-[10px] uppercase font-bold block">Bloquées / Conflits</span>
                <span className="text-2xl font-bold font-mono">{batchResult.blockedCount}</span>
                <span className="text-[11px] block mt-0.5">
                  {batchResult.blockedCount > 0 ? 'Ignorées par sécurité' : 'Aucun conflit détecté'}
                </span>
              </div>
            </div>

            {/* Blocked details if any */}
            {batchResult.blockedCount > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Détail des demandes bloquées par le système anti-conflits :
                </h4>
                <div className="max-h-48 overflow-y-auto divide-y divide-amber-100 border border-amber-200 rounded-xl bg-amber-50/40 text-xs">
                  {batchResult.blockedDetails.map(item => (
                    <div key={item.requestId} className="p-2.5 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-stone-900 font-semibold">{item.studentName}</strong>
                        <span className="text-amber-800 text-[10px] font-mono font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                          Exemplaire n°{item.copyNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 truncate">{item.bookTitle}</p>
                      <p className="text-[11px] text-rose-700 font-medium">⚠️ Motif : {item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 leading-relaxed">
              La double vérification garantit qu'aucun exemplaire n'est attribué deux fois et que le plafond de 3 emprunts n'est jamais dépassé lors d'un traitement en masse.
            </p>

            <button
              type="button"
              onClick={() => setBatchResult(null)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Compris, fermer le rapport
            </button>
          </div>
        </div>
      )}

      {/* 7. Rejection Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-100">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Refuser {rejectingIds.length > 1 ? `${rejectingIds.length} demandes` : 'la demande'}
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Les exemplaires associés redeviendront immédiatement disponibles en rayon et chaque étudiant recevra la notification persistante officielle de refus.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-700 uppercase">
                Motif du refus (optionnel) :
              </label>
              <input
                type="text"
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                placeholder="Ex : Exemplaire réservé à la consultation sur place, problème d'inventaire..."
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
