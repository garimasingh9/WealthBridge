import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "missing-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "missing-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "missing-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "missing-bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "missing-sender",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:12345"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
