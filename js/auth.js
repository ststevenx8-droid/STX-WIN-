// STX WIN Authorization Actions Controller
import { auth, googleProvider } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Monitor current login status
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("sidebar-login-btn");
    const userCard = document.getElementById("sidebar-user-card");
    const userName = document.getElementById("user-display-name");

    if (user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (userCard) {
            userCard.style.display = "flex";
            if (userName) userName.textContent = user.displayName || user.email.split("@")[0];
        }
    } else {
        if (loginBtn) loginBtn.style.display = "block";
        if (userCard) userCard.style.display = "none";
    }
});

// Standard user sign in
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = "index.html";
        } catch (error) {
            alert("Error Authenticating user: " + error.message);
        }
    });
}

// User signup
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;

        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            window.location.href = "index.html";
        } catch (error) {
            alert("Registration Issue: " + error.message);
        }
    });
}

// Google Pop-Up Authenticator
const googleBtn = document.getElementById("google-signin-btn");
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            window.location.href = "index.html";
        } catch (error) {
            alert("Google Sign-In Error: " + error.message);
        }
    });
}

// Log out handler
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.reload();
        } catch (error) {
            console.error("Sign Out failed: ", error);
        }
    });
}
