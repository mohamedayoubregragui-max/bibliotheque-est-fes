import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider setup with userinfo scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
// Set custom parameters to encourage account picker
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'usmba.ac.ma', // Hint domain to Google account picker
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Result of USMBA Google Authentication check
 */
export interface USMBAGoogleAuthResult {
  success: boolean;
  user?: User;
  email?: string;
  domain?: string;
  errorMessage?: string;
  isUsmbaDomain: boolean;
}

/**
 * Validate that an email belongs strictly to @usmba.ac.ma
 */
export const isUsmbaEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith('@usmba.ac.ma');
};

/**
 * Signs in using Google OAuth popup and enforces strict domain restriction.
 * If the user signs in with a non-USMBA email (e.g. personal @gmail.com),
 * Firebase immediately signs them out and returns a clear denial.
 */
export const signInWithGoogleUSMBA = async (): Promise<USMBAGoogleAuthResult> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const email = user.email || '';

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    // Strict Domain Enforcement
    if (!isUsmbaEmail(email)) {
      // Disconnect immediately
      await signOut(auth);
      cachedAccessToken = null;

      return {
        success: false,
        email,
        domain: email.split('@')[1] || 'inconnu',
        isUsmbaDomain: false,
        errorMessage: 'Accès refusé : veuillez utiliser votre compte universitaire USMBA (@usmba.ac.ma).',
      };
    }

    return {
      success: true,
      user,
      email,
      domain: 'usmba.ac.ma',
      isUsmbaDomain: true,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);

    // Friendly message mapping
    let errorMsg = "Impossible d'effectuer la connexion avec Google. Veuillez réessayer.";
    if (error.code === 'auth/popup-closed-by-user') {
      errorMsg = "La fenêtre de connexion Google a été fermée avant la fin de l'opération.";
    } else if (error.code === 'auth/popup-blocked') {
      errorMsg = "La fenêtre surgissante Google a été bloquée par votre navigateur. Autorisez les popups pour continuer.";
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMsg = "Demande d'authentification annulée.";
    }

    return {
      success: false,
      isUsmbaDomain: false,
      errorMessage: errorMsg,
    };
  } finally {
    isSigningIn = false;
  }
};

/**
 * Logout helper
 */
export const logoutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
    cachedAccessToken = null;
  } catch (err) {
    console.error('Logout error:', err);
  }
};

/**
 * Access token getter
 */
export const getCachedAccessToken = (): string | null => cachedAccessToken;
