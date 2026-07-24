import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Use custom database ID if specified in config
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)")
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn("Google popup sign-in issue:", error);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error("Redirect auth error:", redirectError);
        throw new Error("Google popup window was blocked by browser policies. Please use Email Sign-In or open app in a new tab.");
      }
    }
    throw error;
  }
};

export const registerWithEmail = async (email: string, pass: string, name: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (cred.user && name) {
    await updateProfile(cred.user, { displayName: name });
  }
  return cred.user;
};

export const loginWithEmail = async (email: string, pass: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
