// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDJTjf-d0Ru9qTJvlbv306rO5nyD1unjg",
  authDomain: "portfoliobuilder-d2d6e.firebaseapp.com",
  projectId: "portfoliobuilder-d2d6e",
  storageBucket: "portfoliobuilder-d2d6e.firebasestorage.app",
  messagingSenderId: "448567916590",
  appId: "1:448567916590:web:011d37d7a3b45e6f1047bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);