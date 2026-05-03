import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

console.log("Checking Firebase Env Variables...");
console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "Loaded" : "Missing");
console.log("VITE_FIREBASE_AUTH_DOMAIN:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing");

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

let app = null;
let auth = null;
let googleProvider = null;

const isConfigValid = apiKey && apiKey !== "your_api_key_here" && apiKey !== "YOUR_API_KEY";

if (!isConfigValid) {
    console.error(`
🔴 FIREBASE CONFIGURATION ERROR:
Your Firebase API Key is missing or invalid.
Please follow these steps:
1. Go to Firebase Console (https://console.firebase.google.com/)
2. Open your project settings.
3. Copy the web app configuration.
4. Replace the placeholder values in frontend/.env with your actual values.
5. RESTART your Vite dev server (Ctrl+C, then npm run dev).
    `);
} else {
    try {
        const firebaseConfig = {
            apiKey: apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID
        };

        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
    }
}

export { app, auth, googleProvider };
