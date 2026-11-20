import React, { useState, useRef } from 'react';
import { Loan, Book, StudentMember, BookCopy, LoanRequest } from '../types/library';
import {
  X,
  Download,
  Building2,
  GraduationCap,
  ShieldCheck,
  FileCheck,
  Clock,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { BookCoverBadge } from './BookCoverBadge';

interface LoanReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan?: Loan | null;
  request?: LoanRequest | null;
  book: Book | null;
  student: StudentMember | null;
  copy?: BookCopy | null;
}

export const LoanReceiptModal: React.FC<LoanReceiptModalProps> = ({
  isOpen,
  onClose,
  loan,
  request,
  book,
  student,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptCardRef = useRef<HTMLDivElement>(null);

  const activeEntity = loan || request;

  if (!isOpen || !activeEntity) return null;

  const isLoan = !!loan;

  let operationStatus: 'en_attente_retrait' | 'livre_recupere' | 'livre_retourne' = 'en_attente_retrait';

  if (loan) {
    if (loan.returnDate || loan.status === 'returned') {
      operationStatus = 'livre_retourne';
    } else {
      operationStatus = 'livre_recupere';
    }
  } else if (request) {
    if (request.status === 'approved' || request.loanId) {
      operationStatus = 'livre_recupere';
    } else {
      operationStatus = 'en_attente_retrait';
    }
  }

  const isOverdue = isLoan && !loan?.returnDate && loan?.status === 'overdue';

  const receiptNum = isLoan
    ? loan?.receiptNumber || `REC-2026-${loan?.id.replace('l-', '').toUpperCase()}`
    : request?.receiptNumber || `RES-2026-${request?.id.replace('req-', '').toUpperCase()}`;

  // Download Receipt Card as PNG image using html-to-image
  const handleDownloadPNG = async () => {
    if (!receiptCardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(receiptCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `Recu_USMBA_${receiptNum}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export receipt image', err);
      alert("Erreur lors de la génération de l'image du reçu. Veuillez réessayer.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Student details resolution
  const studentFullName = student
    ? `${student.firstName} ${student.lastName}`
    : request?.studentName || 'Étudiant USMBA';

  const studentInstitutionalId = student?.institutionalId || request?.studentInstitutionalId || loan?.studentId || 'USMBA-EST';

  // Book details resolution
  const bookTitle = book?.title || request?.bookTitle || 'Ouvrage universitaire';
  const bookAuthor = book?.author || request?.author || 'Auteur inconnu';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider truncate">
              {operationStatus === 'en_attente_retrait'
                ? 'Récépissé de Réservation'
                : operationStatus === 'livre_retourne'
                ? 'Reçu de Restitution'
                : "Reçu d'Emprunt Officiel"} · USMBA
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body Container */}
        <div className="p-4 sm:p-5 bg-stone-100 flex flex-col items-center overflow-y-auto">
          {/* Printable / Downloadable Card */}
          <div
            ref={receiptCardRef}
            className="w-full bg-white border-2 border-emerald-900/80 rounded-xl p-5 shadow-sm space-y-4 text-stone-900 font-sans relative"
          >
            {/* Academic Header */}
            <div className="border-b-2 border-emerald-800 pb-3 text-center space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-left">
                  <Building2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                  EST FÈS
                </span>
              </div>

              <p className="text-[10px] sm:text-[11px] text-stone-600 font-semibold tracking-tight text-center">
                ÉCOLE SUPÉRIEURE DE TECHNOLOGIE DE FÈS · SERVICE DOCUMENTAIRE
              </p>

              {/* Title Banner */}
              <div className="pt-1.5">
                <div className={`text-white py-1 px-3.5 rounded-lg font-bold text-xs tracking-wider uppercase inline-block shadow-2xs border ${
                  operationStatus === 'en_attente_retrait'
                    ? 'bg-amber-900 border-amber-800'
                    : operationStatus === 'livre_retourne'
                    ? 'bg-stone-800 border-stone-700'
                    : 'bg-emerald-950 border-emerald-800'
                }`}>
                  {operationStatus === 'en_attente_retrait'
                    ? 'RÉCÉPISSÉ DE RÉSERVATION EN LIGNE'
                    : operationStatus === 'livre_retourne'
                    ? "REÇU OFFICIEL DE RESTITUTION D'OUVRAGE"
                    : "REÇU OFFICIEL D'EMPRUNT"}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1">
                <span>N° DE REÇU : <strong className="text-stone-900 font-bold">{receiptNum}</strong></span>
                <span>DATE : {isLoan ? loan?.borrowDate : request?.requestDate}</span>
              </div>
            </div>

            {/* Grid Content: Student Info + Book Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Box 1: Student Identity */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/90 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[10px] border-b border-emerald-200 pb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-800" />
                  <span>IDENTITÉ DE L'ÉTUDIANT</span>
                </div>

                <div className="space-y-1">
                  <div>
                    <span className="text-[9px] text-stone-400 block uppercase">Nom & Prénom</span>
                    <span className="font-bold text-stone-900 text-xs">
                      {studentFullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-stone-400 block uppercase">Code Étudiant / ID</span>
                    <span className="font-mono font-semibold text-emerald-800 text-[11px]">
                      {studentInstitutionalId}
                    </span>
                  </div>

                  {student && (
                    <div>
                      <span className="text-[9px] text-stone-400 block uppercase">Filière</span>
                      <span className="text-stone-700 font-medium text-[11px]">
                        {student.sector} ({student.studyYear})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Book & Copy Info */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-stone-900 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200 pb-1">
                  <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                  <span>OUVRAGE & EXEMPLAIRE</span>
                </div>

                <div className="flex items-start gap-2">
                  <BookCoverBadge
                    category={book?.category || 'Général'}
                    department={book?.department || request?.department || 'Génie Informatique'}
                    title={bookTitle}
                    coverUrl={book?.coverUrl || request?.coverUrl}
                    size="sm"
                  />
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className="font-bold text-stone-900 leading-tight text-xs line-clamp-2">
                      {bookTitle}
                    </h4>
                    <p className="text-[10px] text-stone-600 truncate">{bookAuthor}</p>
                    <div className="pt-0.5 text-[10px] font-mono text-stone-700 space-y-0.5">
                      <p>Exemplaire : <strong className="text-stone-900">N°{activeEntity.copyNumber}</strong></p>
                      <p className="text-stone-500">Réf. Exemplaire : <strong className="text-stone-700">{activeEntity.qrCode}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Dates */}
            <div className="p-3 bg-white rounded-xl border border-stone-300 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  Statut de l'Opération :
                </span>

                {operationStatus === 'en_attente_retrait' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>EN ATTENTE DE RETRAIT</span>
                  </span>
                )}

                {operationStatus === 'livre_recupere' && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono text-white flex items-center gap-1 ${
                    isOverdue ? 'bg-rose-700 border border-rose-800' : 'bg-emerald-800 border border-emerald-900'
                  }`}>
                    {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    <span>LIVRE RÉCUPÉRÉ {isOverdue ? '(RETARD)' : ''}</span>
                  </span>
                )}

                {operationStatus === 'livre_retourne' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-stone-200 text-stone-800 border border-stone-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-stone-700" />
                    <span>LIVRE RETOURNÉ</span>
                  </span>
                )}
              </div>

              {/* Dates grid */}
              {isLoan ? (
                <div className="grid grid-cols-3 gap-2 text-center pt-0.5 font-mono">
                  <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[9px] text-stone-400 block uppercase font-sans">Date d'emprunt</span>
                    <strong className="text-stone-900 text-[11px]">{loan?.borrowDate}</strong>
                  </div>

                  <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[9px] text-stone-400 block uppercase font-sans">
                      {operationStatus === 'livre_retourne' ? 'Restitution' : 'Durée'}
                    </span>
                    <strong className="text-stone-900 text-[11px]">
                      {operationStatus === 'livre_retourne' ? loan?.returnDate : '21 Jours'}
                    </strong>
                  </div>

                  <div className={`p-1.5 rounded-lg border ${
                    isOverdue
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  }`}>
                    <span className="text-[9px] block uppercase font-bold font-sans">
                      {isOverdue ? '⚠️ Retard' : 'Retour Prévu'}
                    </span>
                    <strong className="text-[11px] font-bold">{loan?.dueDate}</strong>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-center pt-0.5 font-mono">
                  <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[9px] text-stone-400 block uppercase font-sans">Date de Demande</span>
                    <strong className="text-stone-900 text-[11px]">{request?.requestDate}</strong>
                  </div>

                  <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-[9px] text-amber-800 block uppercase font-bold font-sans">Retour Prévu</span>
                    <strong className="text-amber-950 text-[11px] font-bold">21 jours dès remise</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Electronic Seal and Signature */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-stone-600 text-[10px]">
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-950 flex items-center gap-1 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Justificatif Officiel USMBA</span>
                </p>
                <p className="font-mono text-[9px] text-stone-400">Réf. transaction : {activeEntity.id}</p>
              </div>

              <div className="inline-block p-1.5 rounded border border-emerald-800/40 bg-emerald-50/40 text-emerald-900 font-mono text-center">
                <span className="font-bold block uppercase text-[9px]">Cachet Électronique EST</span>
                <span className="text-[8px] text-stone-500">BIBLIOTHÈQUE USMBA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area: Download Only + Explanatory Note */}
        <div className="px-5 py-4 bg-white border-t border-stone-200 flex flex-col items-center gap-2 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadPNG}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Génération du reçu...' : 'Télécharger le reçu (Image)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>

          {/* Discreet Explanatory Note */}
          <p className="text-[11px] text-stone-500 text-center font-medium">
            Conservez ce reçu téléchargé comme preuve en cas de problème système
          </p>
        </div>
      </div>
    </div>
  );
};
