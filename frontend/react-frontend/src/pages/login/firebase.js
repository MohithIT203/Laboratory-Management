import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTCG23038D_FxzQdvbjJ4BjzImDCv7nu8",
  authDomain: "lab-slot.firebaseapp.com",
  projectId: "lab-slot",
  storageBucket: "lab-slot.firebasestorage.app",
  messagingSenderId: "579248089424",
  appId: "1:579248089424:web:4cdd8346f4f17fcc41a455",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

export { auth, provider };
