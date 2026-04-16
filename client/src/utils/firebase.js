import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-2e61e.firebaseapp.com",
  projectId: "interviewiq-2e61e",
  storageBucket: "interviewiq-2e61e.firebasestorage.app",
  messagingSenderId: "174811259958",
  appId: "1:174811259958:web:5737756fd7ba06145e6497",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
