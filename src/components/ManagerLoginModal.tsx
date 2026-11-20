import React, { useState } from 'react';
import { X, Shield, Lock, ArrowRight, KeyRound } from 'lucide-react';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Code de sécurité ou mot de passe administrateur pour l'espace gérant
    const trimmed = accessCode.trim().toLowerCase();
    if (trimmed === 'admin' || trimmed === 'gerant' || trimmed === 'est' || trimmed === '1234' || trimmed === 'usmba') {
      onSuccess();
      onClose();
      setAccessCode('');
    } else {
      setErrorMessage("Identifiant ou code d'accès administrateur incorrect. (Astuce : saisissez 'admin' ou 'gerant').");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Connexion Espace Gérant</h2>
              <p className="text-xs text-stone-400 font-mono">Administration EST Fès</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Accès restreint au personnel de la bibliothèque :</p>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Pour accéder aux indicateurs visuels, aux relances et au registre des retards, veuillez vous authentifier en tant que gérant.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Code d'accès administrateur :
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                required
                type="password"
                placeholder="Ex: admin"
                value={accessCode}
                onChange={e => {
                  setAccessCode(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-stone-400">
              Code par défaut : <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">admin</code>
            </p>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
              {errorMessage}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-2xs transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accéder à l'Espace Gérant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
