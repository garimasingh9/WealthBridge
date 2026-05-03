import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

console.log("Checking Firebase Env Variables...");
const requiredVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID'];
let isValid = true;

requiredVars.forEach(v => {
    const val = import.meta.env[v];
    if (!val || val.includes("your_") || val === "YOUR_API_KEY") {
        console.error(`Missing or invalid environment variable: ${v}`);
        isValid = false;
    }
});

let app = null;
let auth = null;
let googleProvider = null;

if (isValid) {
    try {
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID
        };

        // Ensure no duplicate initialization
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApps()[0];
        }
        
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error("Failed to initialize Firebase without crashing UI:", error);
    }
} else {
    console.error("Firebase initialization skipped due to missing/invalid configuration. Check your .env file.");
}

export { app, auth, googleProvider };
