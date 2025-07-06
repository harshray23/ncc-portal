import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This function ensures Firebase is initialized only once, and only when needed.
function getFirebase() {
  if (getApps().length) {
    const app = getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
  }

  // Check for missing environment variables before attempting to initialize
  const missingVars = Object.entries(firebaseConfig).filter(([,value]) => !value).map(([key]) => key);
  if (missingVars.length > 0) {
      // This provides a clear error message in the server logs or browser console
      // which is much more helpful than the generic "invalid-api-key" error.
      throw new Error(`Firebase initialization failed. The following environment variables are missing: ${missingVars.join(', ')}. Please check your .env file.`);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

export { getFirebase };
