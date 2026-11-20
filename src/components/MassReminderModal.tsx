import React, { useState } from 'react';
import { Loan, Book, BookCopy, StudentMember } from '../types/library';
import { X, Mail, Copy, Check, Send, AlertTriangle } from 'lucide-react';
import { calculateDaysDifference, CURRENT_DATE } from '../utils/storage';

interface MassReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLoans: Loan[];
  books: Book[];
  copies: BookCopy[];
  students: StudentMember[];
  onConfirmSend: (loanIds: string[]) => void;
}

export const MassReminderModal: React.FC<MassReminderModalProps> = ({
  isOpen,
  onClose,
  selectedLoans,
  books,
  copies,
  students,
  onConfirmSend,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || selectedLoans.length === 0) return null;

  const bookMap = new Map(books.map(b => [b.id, b]));
  const copyMap = new Map(copies.map(c => [c.id, c]));
  const studentMap = new Map(students.map(s => [s.id, s]));

  const recipientEmails = Array.from(
    new Set(
      selectedLoans
        .map(l => studentMap.get(l.studentId)?.email)
        .filter((e): e is string => !!e)
    )
  );

  const sampleTemplate = `Objet : [Bibliothèque EST Fès - USMBA] Relance urgente : Restitution d'exemplaire(s) en retard

Madame, Monsieur l'étudiant(e),

Nos relevés indiquent que vous avez dépassé l'échéance autorisée pour la restitution d'exemplaire(s) de la bibliothèque de l'EST Fès.
Nous vous prions de restituer ces ouvrages au comptoir de la bibliothèque sans délai afin de libérer les exemplaires pour vos camarades.

Le service de prêt - Bibliothèque EST Fès (USMBA)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    onConfirmSend(selectedLoans.map(l => l.id));
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-rose-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-950">
                Envoi de Relance en Masse ({selectedLoans.length} emprunt(s) sélectionné(s))
              </h2>
              <p className="text-xs text-rose-800">
                Notification automatique envoyée aux adresses institutionnelles USMBA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Summary Box */}
          <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-700">Destinataires uniques :</span>
              <span className="font-mono text-stone-900 font-bold">{recipientEmails.length} étudiant(s) EST</span>
            </div>
            <div className="max-h-20 overflow-y-auto font-mono text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-200">
              {recipientEmails.join(', ')}
            </div>
          </div>

          {/* List of concerned loans */}
          <div>
            <h4 className="font-semibold text-stone-800 uppercase tracking-wider mb-2">
              Détail des exemplaires concernés par la relance :
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto border border-stone-200 rounded-lg p-2 divide-y divide-stone-100">
              {selectedLoans.map(loan => {
                const book = bookMap.get(loan.bookId);
                const student = studentMap.get(loan.studentId);
                const daysLate = Math.abs(calculateDaysDifference(loan.dueDate, CURRENT_DATE));

                return (
                  <div key={loan.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{book?.title}</span>
                      <span className="font-mono text-[11px] text-stone-500 ml-2">
                        Exemplaire n°{loan.copyNumber} ({loan.qrCode})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-stone-800 block">
                        {student?.firstName} {student?.lastName}
                      </span>
                      <span className="text-[10px] text-rose-700 font-mono font-semibold">
                        Retard: {daysLate} jour(s)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message template preview */}
          <div>
            <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Modèle d'e-mail officiel :
            </label>
            <textarea
              readOnly
              rows={5}
              value={sampleTemplate}
              className="w-full p-2.5 font-mono text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {isSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Les e-mails de relance ont été expédiés en un seul clic !</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié' : 'Copier le texte'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Fermer
            </button>
            <button
              type="button"
              disabled={isSent}
              onClick={handleSend}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-2xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer à tous ({selectedLoans.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
