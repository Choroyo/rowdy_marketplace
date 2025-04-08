// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDojJtJPuK6Anb7rrSrtokx3nyfWDsLIZs",
  authDomain: "rowdy-marketpla.firebaseapp.com",
  projectId: "rowdy-marketpla",
  storageBucket: "rowdy-marketpla.firebasestorage.app",
  messagingSenderId: "1081743983370",
  appId: "1:1081743983370:web:7478959d19c71df78af0f3",
  measurementId: "G-05LFX9X3R7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
