import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAx8HGzIFi-jpa8uMV8bp3rN_IdL_JfpQ",
  authDomain: "kakeibo-dev-10000.firebaseapp.com",
  projectId: "kakeibo-dev-10000",
  storageBucket: "kakeibo-dev-10000.firebasestorage.app",
  messagingSenderId: "905957323245",
  appId: "1:905957323245:web:978266e7b5f9d86e04b7e4",
  measurementId: "G-0LDDPX3L48"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
