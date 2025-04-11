import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSvDnJ1J3PuK6AnY7rrSrtokx3nYfWDSLTZs",
    authDomain: "rowdy-marketpla.firebaseapp.com",
    projectId: "rowdy-marketpla",
    storageBucket: "rowdy-marketpla.firebasestorage.app",
    messagingSenderId: "1081743983370",
    appId: "1:1081743983370:web:7478959d19c71df78af0f3",
    measurementId: "G-D5LFX9X3R7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);