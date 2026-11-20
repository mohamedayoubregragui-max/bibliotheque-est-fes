import React, { useState } from 'react';
import { StudentMember, StudentSector } from '../types/library';
import { X, Users, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface MassImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStudents: (students: StudentMember[]) => void;
  existingCount: number;
}

export const MassImportModal: React.FC<MassImportModalProps> = ({
  isOpen,
  onClose,
  onImportStudents,
  existingCount,
}) => {
  const [csvText, setCsvText] = useState<string>(
`Ayoub,El Fassi,ayoub.elfassi@usmba.ac.ma,0611223344,DUT Informatique,1ère Année
Zineb,Berrada,zineb.berrada@usmba.ac.ma,0622334455,DUT Génie Industriel,2ème Année
Hamza,Alaoui,hamza.alaoui@usmba.ac.ma,0633445566,Licence Pro DSI,Licence Pro
Fatima-Zahra,Tahiri,fz.tahiri@usmba.ac.ma,0644556677,DUT Génie Électrique,1ère Année`
  );

  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessImport = () => {
    const lines = csvText.trim().split('\n');
    const parsedStudents: StudentMember[] = [];
    let startingIndex = existingCount + 10;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        const firstName = parts[0];
        const lastName = parts[1];
        const email = parts[2];
        const phone = parts[3] || '06 00 00 00 00';
        const sector = (parts[4] as StudentSector) || 'DUT Informatique';
        const studyYear = (parts[5] as StudentMember['studyYear']) || '1ère Année';

        startingIndex += 1;
        const institutionalId = `USMBA-EST-2026-${startingIndex}`;
        const apogeeCode = `${25000000 + startingIndex}`;
        const cne = `N13${startingIndex}${Math.floor(100 + Math.random() * 900)}`;

        parsedStudents.push({
          id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          institutionalId,
          apogeeCode,
          cne,
          firstName,
          lastName,
          email,
          phone,
          institution: 'EST Fès - USMBA',
          sector,
          studyYear,
          status: 'active',
          registeredDate: '2026-11-09',
          maxAllowedLoans: 3,
        });
      }
    }

    if (parsedStudents.length === 0) {
      setFeedback("Aucune ligne valide n'a pu être interprétée. Veuillez vérifier le format CSV.");
      return;
    }

    onImportStudents(parsedStudents);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Saisie en Masse & Importation de la Liste d'Inscriptions
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Attribution automatique d'identifiants USMBA et droits de prêt EST
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

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
            <p className="font-semibold text-stone-800">Format d'importation CSV :</p>
            <code className="font-mono text-stone-600 block bg-white p-2 rounded border border-stone-200 text-[11px]">
              Prénom, Nom, email_institutionnel, téléphone, Filière_EST, Année_Étude
            </code>
            <p className="text-[11px] text-stone-500">
              Chaque ligne génère un compte étudiant EST actif avec un code Apogée, un CNE et son identifiant USMBA unique.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Coller la liste des étudiants à inscrire :
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {feedback && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleProcessImport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Valider l'importation en masse</span>
          </button>
        </div>
      </div>
    </div>
  );
};
