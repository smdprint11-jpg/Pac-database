import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// In-memory ID token storage (never stored in localStorage)
let currentIdToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentIdToken = token;
}

export async function getValidAuthToken(): Promise<string | null> {
  if (auth.currentUser) {
    try {
      currentIdToken = await auth.currentUser.getIdToken();
      return currentIdToken;
    } catch {
      return currentIdToken;
    }
  }
  return currentIdToken;
}
