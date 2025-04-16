// src/lib/firebase.ts

// Database Schema

// ProductID
// title (string): 
// description (string): 
// price (number):
// images (array): 
// sellerId (string): 
// status (string): available/sold
// createdAt (timestamp): 

// UserID (now using email as document ID)
// firstName (string): 
// lastName (string): 
// email (string): 
// role (string): user/seller/admin 
// products (array): 
// paymentDetails (object): 
// ratings (array):
// password (string): (Only for temporary implementation - REMOVE IN PRODUCTION)

// TransactionID
// productId (string):
// buyerId (string):
// sellerId (string):
// price (number):
// status (string): pending/completed/cancelled
// createdAt (timestamp):

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your app's Firebase project configuration
// Get these values from Firebase Console -> Project settings -> Your apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: "AlzaSyDojJtJPuK6Anb7rrSrtokx3nyfWDsLIZs",
  authDomain: "rowdy-marketpla.firebaseapp.com",
  projectId: "rowdy-marketpla",
  storageBucket: "rowdy-marketpla.appspot.com",
  messagingSenderId: "1081743983370",
  appId: "1:1081743983370:web:7478959d19c71df78af0f3"
};

// Note: We are implementing a temporary custom authentication system using Firestore
// directly for user storage and authentication instead of Firebase Auth

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };