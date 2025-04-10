// src/lib/firebase.ts

// Database Schema

// ProductID
// name (string):
// price (number):
// description (string): 
// images (array): 
// category (string): 
// createdBy (string): 
// createdAt (timestamp): 
// status (string): 

// UserID
// name (string): 
// email (string): 
// role (string): 
// products (array): 

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };