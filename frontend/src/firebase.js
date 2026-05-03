import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

console.log("Firebase Env Keys Loaded:", {
    apiKey: apiKey ? "Loaded" : "Missing",
    domain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing",
    project: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "Loaded" : "Missing"
});

if (!apiKey || apiKey === "missing-api-key") {
    console.error("Firebase API Key is missing or invalid. Please check your .env file and restart the Vite dev server.");
}

const firebaseConfig = {
    apiKey: apiKey || "missing-api-key",
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
