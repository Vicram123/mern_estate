// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "niina-estate.firebaseapp.com",
  projectId: "niina-estate",
  storageBucket: "niina-estate.firebasestorage.app",
  messagingSenderId: "939595874043",
  appId: "1:939595874043:web:9d8e48ffda06dc5d70ba5e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
