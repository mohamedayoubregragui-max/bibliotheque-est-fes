import React from 'react';
import { Book, BookCopy } from '../types/library';
import {
  X,
  QrCode,
  MapPin,
  AlertCircle,
  Layers,
  Zap,
  LogIn,
} from 'lucide-react';
import { BookCoverBadge } from './BookCoverBadge';

interface StudentBookModalProps {
  book: Book | null;
  copies: BookCopy[];
  isOpen: boolean;
  onClose: () => void;
  onExpressBorrow: (book: Book, copy: BookCopy) => void;
  isStudentConnected: boolean;
  onRequireLogin: () => void;
  canBorrow: boolean;
  borrowBlockReason?: string;
  studentTotalEngaged?: number;
  maxQuota?: number;
}

// Helper garantissant un résumé ultra-concis (2 à 3 phrases maximum)
function formatConciseSummary(summary: string): string {
  const cleaned = summary.trim();
  if (!cleaned) return '';
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 3) return cleaned;
  return sentences.slice(0, 3).join(' ').trim();
}

export const StudentBookModal: React.FC<StudentBookModalProps> = ({
  book,
  copies,
  isOpen,
  onClose,
  onExpressBorrow,
  isStudentConnected,
  onRequireLogin,
  canBorrow,
  borrowBlockReason,
  studentTotalEngaged = 0,
  maxQuota = 3,
}) => {
  if (!isOpen || !book) return null;

  const bookCopies = copies.filter(c => c.bookId === book.id);
  const availableCopies = bookCopies.filter(c => c.status === 'disponible');
  const conciseSummary = formatConciseSummary(book.summary);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span className="font-bold text-amber-800 uppercase tracking-wider truncate">
              {book.department}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500 truncate">{book.category}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Single-Screen Content (No scrolling / No tabs / No chapters) */}
        <div className="p-5 space-y-4">
          {/* Book Core Summary Strip: Cover + Title + Author + Concise 2-3 sentence summary */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-28 sm:w-32 shrink-0 mx-auto sm:mx-0">
              <BookCoverBadge
                category={book.category}
                department={book.department}
                title={book.title}
                coverUrl={book.coverUrl}
                size="lg"
                className="max-w-none!"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h2 className="text-lg font-bold text-stone-900 leading-snug">
                  {book.title}
                </h2>
                <p className="text-xs text-stone-600 font-semibold mt-0.5">
                  {book.author}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500">
                <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{book.shelfLocation}</span>
                </span>
                <span className="text-stone-300">·</span>
                <span>{book.publisher} ({book.publishedYear})</span>
              </div>

              {/* Short 2-3 sentence summary only */}
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/80 line-clamp-3">
                {conciseSummary}
              </p>
            </div>
          </div>

          {/* Direct Copies List & 1-Click Express Borrow */}
          <div className="space-y-2.5 pt-3 border-t border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-700" />
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Exemplaires ({availableCopies.length} disponible{availableCopies.length > 1 ? 's' : ''} / {bookCopies.length})
                </h3>
              </div>

              {isStudentConnected ? (
                <span className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  !canBorrow
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Mon quota : {studentTotalEngaged} / {maxQuota}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Se connecter (@usmba.ac.ma) pour emprunter</span>
                </button>
              )}
            </div>

            {/* Quota Reached Warning */}
            {isStudentConnected && !canBorrow && borrowBlockReason && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium leading-snug">{borrowBlockReason}</span>
              </div>
            )}

            {/* Compact Copies List */}
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
              {bookCopies.map(copy => {
                const isDispo = copy.status === 'disponible';

                return (
                  <div
                    key={copy.id}
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                      isDispo ? 'hover:bg-amber-50/40' : 'bg-stone-50/70 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                        <QrCode className="w-4 h-4 text-stone-700" />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            Exemplaire n°{copy.copyNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            isDispo
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isDispo ? 'Disponible' : 'Emprunté'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-stone-500 truncate">
                          {copy.qrCode} · {copy.condition}
                        </p>
                      </div>
                    </div>

                    {/* 1-Click Express Borrow Button */}
                    <div className="shrink-0">
                      {isDispo ? (
                        <button
                          type="button"
                          disabled={isStudentConnected && !canBorrow}
                          onClick={() => {
                            if (!isStudentConnected) {
                              onRequireLogin();
                              return;
                            }
                            onExpressBorrow(book, copy);
                          }}
                          title={
                            !isStudentConnected
                              ? 'Connectez-vous pour valider votre emprunt en 1 clic'
                              : !canBorrow
                              ? borrowBlockReason
                              : 'Valider immédiatement votre demande en 1 clic'
                          }
                          className="px-3.5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-stone-950" />
                          <span>Demander l'emprunt</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700 px-2">
                          Indisponible
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean Minimal Footer */}
        <div className="px-5 py-2.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-[11px] text-stone-500">
          <span>Emprunt express en 1 clic · Max {maxQuota} emprunts/demandes · Durée 21 jours</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-stone-700 hover:text-stone-950 px-2.5 py-1 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
