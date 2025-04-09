// src/hooks/useFirebaseAuth.ts
import { useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthState({ user, loading: false, error: null });
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      // Only accept email addresses from my.utsa.edu domain
      if (!email.endsWith('@my.utsa.edu')) {
        throw new Error('Only UTSA email addresses (@my.utsa.edu) are allowed');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        name,
        email,
        role: 'user',
        products: []
      });
      
      setAuthState({ user, loading: false, error: null });
      return user;
    } catch (error: any) {
      setAuthState({ ...authState, loading: false, error: error.message });
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user document exists, create if it doesn't
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email || '',
          role: 'user',
          products: []
        });
      }
      
      setAuthState({ user, loading: false, error: null });
      return user;
    } catch (error: any) {
      setAuthState({ ...authState, loading: false, error: error.message });
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      await signOut(auth);
      setAuthState({ user: null, loading: false, error: null });
    } catch (error: any) {
      setAuthState({ ...authState, loading: false, error: error.message });
      throw error;
    }
  };
  
  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    logout
  };
};