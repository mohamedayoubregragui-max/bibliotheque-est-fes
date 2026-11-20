import React, { useState } from 'react';
import { StudentMember } from '../types/library';
import {
  X,
  BookOpen,
  GraduationCap,
  Shield,
  QrCode,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { signInWithGoogleUSMBA, isUsmbaEmail } from '../utils/googleAuth';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentMember[];
  onConnectStudent: (student: StudentMember) => void;
  onRegisterStudent: (newStudent: StudentMember) => void;
  onConnectManager?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  students,
  onConnectStudent,
  onRegisterStudent,
  onConnectManager,
}) => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [showScanSimulation, setShowScanSimulation] = useState(false);

  if (!isOpen) return null;

  // 1. Authentification Google OAuth 2.0 réelle avec restriction @usmba.ac.ma
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsLoadingGoogle(true);

    try {
      const result = await signInWithGoogleUSMBA();

      if (!result.success) {
        // En cas de compte non-USMBA ou erreur
        setErrorMessage(
          result.errorMessage ||
            'Accès refusé : veuillez utiliser votre compte universitaire USMBA (@usmba.ac.ma).'
        );
        return;
      }

      const email = result.email || '';
      const user = result.user;

      // Vérifier si l'étudiant est déjà enregistré dans le registre de la bibliothèque
      let student = students.find(s => s.email.toLowerCase() === email.toLowerCase());

      if (!student) {
        // Déduire le nom et prénom depuis le profil Google ou l'e-mail USMBA
        const displayName = user?.displayName || email.split('@')[0].replace('.', ' ');
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || 'Étudiant';
        const lastName = nameParts.slice(1).join(' ') || 'USMBA';

        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        student = {
          id: `st-${Date.now()}`,
          institutionalId: `USMBA-EST-${new Date().getFullYear()}-${randomSuffix}`,
          apogeeCode: `${25000000 + Math.floor(Math.random() * 99999)}`,
          cne: `USMBA${Math.floor(10000000 + Math.random() * 90000000)}`,
          firstName,
          lastName,
          email,
          phone: '06 00 00 00 00',
          institution: 'EST Fès - USMBA',
          sector: 'DUT Informatique',
          studyYear: '1ère Année',
          status: 'active',
          registeredDate: new Date().toISOString().slice(0, 10),
          maxAllowedLoans: 3,
        };

        onRegisterStudent(student);
      }

      setSuccessInfo(`Authentification réussie : ${student.firstName} ${student.lastName} (${email})`);
      setTimeout(() => {
        if (student) {
          onConnectStudent(student);
          onClose();
        }
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Une erreur imprévue est survenue lors de la connexion Google.");
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // 2. Démo : Étudiant — Démo
  const handleDemoStudent = () => {
    setErrorMessage(null);
    const demoStudent = students[0] || {
      id: 'st-001',
      institutionalId: 'USMBA-EST-2024-4982',
      apogeeCode: '24018942',
      cne: 'N134098412',
      firstName: 'Karim',
      lastName: 'Bennani',
      email: 'karim.bennani@usmba.ac.ma',
      phone: '06 12 34 56 78',
      institution: 'EST Fès - USMBA',
      sector: 'DUT Informatique',
      studyYear: '2ème Année',
      status: 'active',
      registeredDate: '2024-09-15',
      maxAllowedLoans: 3,
    };
    onConnectStudent(demoStudent);
    onClose();
  };

  // 3. Démo : Bibliothécaire — Démo
  const handleDemoManager = () => {
    setErrorMessage(null);
    if (onConnectManager) {
      onConnectManager();
    }
    onClose();
  };

  // 4. Démo : Tester l'inscription par scan
  const handleTestScanRegistration = () => {
    setShowScanSimulation(true);
    setErrorMessage(null);
  };

  const handleConfirmScanStudent = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const scannedStudent: StudentMember = {
      id: `st-scan-${Date.now()}`,
      institutionalId: `USMBA-EST-SCAN-${randomSuffix}`,
      apogeeCode: `${25000000 + Math.floor(Math.random() * 99999)}`,
      cne: `R${Math.floor(10000000 + Math.random() * 90000000)}`,
      firstName: 'Yassine',
      lastName: 'El Amrani',
      email: 'yassine.elamrani@usmba.ac.ma',
      phone: '06 98 76 54 32',
      institution: 'EST Fès - USMBA',
      sector: 'DUT Génie Électrique',
      studyYear: '1ère Année',
      status: 'active',
      registeredDate: new Date().toISOString().slice(0, 10),
      maxAllowedLoans: 3,
    };
    onRegisterStudent(scannedStudent);
    onConnectStudent(scannedStudent);
    setShowScanSimulation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-stone-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
        {/* Close button top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header avec logo universitaire & icône de bibliothèque */}
        <div className="pt-8 pb-5 px-6 text-center flex flex-col items-center">
          {/* Logo universitaire / Icône de bibliothèque */}
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-800 shadow-2xs">
              <BookOpen className="w-7 h-7 text-amber-700" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-stone-900 text-amber-300 border-2 border-white flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Bienvenue à la bibliothèque
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
            Connectez-vous avec votre compte universitaire
          </p>

          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-900">
            <span>Accès exclusif USMBA (@usmba.ac.ma)</span>
          </div>
        </div>

        {/* Body Container */}
        <div className="px-6 pb-6 space-y-5 text-xs">
          {/* Message d'erreur (notamment refus de domaine hors @usmba.ac.ma) */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <p className="font-bold text-rose-900 text-xs">Accès refusé</p>
                <p className="text-[11px] leading-relaxed font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Message de succès */}
          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">{successInfo}</span>
            </div>
          )}

          {/* 1. Grand bouton « Se connecter avec Google » */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoadingGoogle}
              onClick={handleGoogleLogin}
              className="w-full h-12 px-4 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoadingGoogle ? (
                <div className="flex items-center gap-2 text-stone-600">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                  <span>Connexion avec Google...</span>
                </div>
              ) : (
                <>
                  {/* Logo officiel Google en SVG multi-couleurs */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm font-medium tracking-wide">
                    Se connecter avec Google
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-tight">
              Authentification sécurisée Google OAuth 2.0 · Aucun mot de passe requis
            </p>
          </div>

          {/* Séparateur élégant */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              ou
            </span>
          </div>

          {/* Section 3: Espace de Démonstration */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Démonstration</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">Données simulées</span>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              Découvrez les fonctionnalités de la bibliothèque sans utiliser de compte universitaire :
            </p>

            <div className="space-y-1.5 pt-1">
              {/* Option Démo 1 : Étudiant — Démo */}
              <button
                type="button"
                onClick={handleDemoStudent}
                className="w-full px-3 py-2 bg-white hover:bg-stone-100/90 border border-stone-200 hover:border-stone-300 rounded-lg text-stone-800 flex items-center justify-between text-xs font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-stone-900">Étudiant — Démo</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                    (Karim Bennani · EST)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 group-hover:text-stone-800 transition-all" />
              </button>

              {/* Option Démo 2 : Bibliothécaire — Démo */}
              <button
                type="button"
                onClick={handleDemoManager}
                className="w-full px-3 py-2 bg-white hover:bg-stone-100/90 border border-stone-200 hover:border-stone-300 rounded-lg text-stone-800 flex items-center justify-between text-xs font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-stone-700" />
                  <span className="font-semibold text-stone-900">Bibliothécaire — Démo</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                    (Administration & Relances)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 group-hover:text-stone-800 transition-all" />
              </button>

              {/* Option Démo 3 : Tester l'inscription par scan */}
              <button
                type="button"
                onClick={handleTestScanRegistration}
                className="w-full px-3 py-2 bg-white hover:bg-stone-100/90 border border-stone-200 hover:border-stone-300 rounded-lg text-stone-800 flex items-center justify-between text-xs font-medium transition-all group"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-stone-900">Tester l'inscription par scan</span>
                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                    (Badge étudiant RFID/QR)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 group-hover:text-stone-800 transition-all" />
              </button>
            </div>
          </div>

          {/* Modal interne de simulation de scan de badge si sélectionné */}
          {showScanSimulation && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>Simulation Scan de Carte Universitaire</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScanSimulation(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Le lecteur optique détecte les données encodées sur la carte étudiante de l'EST Fès :
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-[11px] space-y-1 text-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-400">Étudiant :</span>
                  <span className="font-semibold">El Amrani Yassine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Email USMBA :</span>
                  <span className="text-emerald-800">yassine.elamrani@usmba.ac.ma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Code CNE / QR :</span>
                  <span className="text-stone-700">QR-EST-STUDENT-2026-9812</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConfirmScanStudent}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valider l'inscription par scan & Ouvrir la session</span>
              </button>
            </div>
          )}

          {/* Footer d'information universitaire */}
          <div className="pt-2 text-center text-[10px] text-stone-400 font-mono border-t border-stone-100 flex items-center justify-center gap-2">
            <span>EST Fès</span>
            <span aria-hidden="true">·</span>
            <span>Université Sidi Mohamed Ben Abdellah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
