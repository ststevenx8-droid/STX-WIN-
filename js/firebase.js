// STX WIN Firebase Integration Engine
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Ensure environment keys are retrieved correctly locally
const firebaseConfig = {
    apiKey: "AIzaSyDummyKey_STXWIN_1234567890",
    authDomain: "stx-win-casino.firebaseapp.com",
    projectId: "stx-win-casino",
    storageBucket: "stx-win-casino.appspot.com",
    messagingSenderId: "987654321012",
    appId: "1:987654321012:web:abcdef123456"
};

// Initialize app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
