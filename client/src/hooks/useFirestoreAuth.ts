import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  products: string[];
  password?: string; // Added for temporary implementation - REMOVE IN PRODUCTION
  paymentDetails: Record<string, any>;
  ratings: string[];
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export const useFirestoreAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  
  // Check local storage for user on initial load
  useEffect(() => {
    console.log("[Auth] Checking localStorage for user session");
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("[Auth] Found user in localStorage:", userData.email);
          setAuthState({ 
            user: userData, 
            loading: false, 
            error: null 
          });
        } catch (error) {
          console.error("[Auth] Error parsing user from localStorage:", error);
          localStorage.removeItem('user');
          setAuthState({ 
            user: null, 
            loading: false, 
            error: null 
          });
        }
      } else {
        console.log("[Auth] No user found in localStorage");
        setAuthState({ 
          user: null, 
          loading: false, 
          error: null 
        });
      }
    };
    
    loadUserFromStorage();
  }, []);
  
  // Register new user
  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string = 'user') => {
    try {
      console.log("[Auth] Starting signup process for:", email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check if user already exists
      const userDocRef = doc(db, 'Users', email);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const errorMessage = "This email is already in use. Try another email.";
        console.error("[Auth] Signup error: Email already in use");
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        throw new Error(errorMessage);
      }
      
      // Create user document in Firestore
      console.log("[Auth] Creating user document in Firestore");
      const userData: UserData = {
        firstName,
        lastName,
        email,
        role,
        products: [],
        paymentDetails: {},
        ratings: [],
        password // Only for temporary implementation - REMOVE IN PRODUCTION
      };
      
      await setDoc(userDocRef, userData);
      console.log("[Auth] User document created in Firestore");
      
      // Remove password from userData before storing in state
      const { password: _, ...userDataWithoutPassword } = userData;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
      
      setAuthState({ 
        user: userDataWithoutPassword, 
        loading: false, 
        error: null 
      });
      
      console.log("[Auth] Signup completed successfully");
      return userDataWithoutPassword;
    } catch (error: any) {
      console.error("[Auth] Signup error:", error);
      const errorMessage = error.message || "An error occurred during signup. Please try again.";
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };
  
  // Log in existing user
  const signIn = async (email: string, password: string) => {
    try {
      console.log("[Auth] Starting signin process for:", email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Get user from Firestore
      const userDocRef = doc(db, 'Users', email);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const errorMessage = "No user found with this email.";
        console.error("[Auth] Sign in error: User not found");
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        throw new Error(errorMessage);
      }
      
      const userData = userDoc.data() as UserData & { password: string };
      
      // Compare password
      if (userData.password !== password) {
        const errorMessage = "Incorrect password.";
        console.error("[Auth] Sign in error: Incorrect password");
        setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
        throw new Error(errorMessage);
      }
      
      console.log("[Auth] User authenticated:", email);
      
      // Remove password from userData before storing in state
      const { password: _, ...userDataWithoutPassword } = userData;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
      
      setAuthState({ 
        user: userDataWithoutPassword, 
        loading: false, 
        error: null 
      });
      
      console.log("[Auth] Sign in completed successfully");
      return userDataWithoutPassword;
    } catch (error: any) {
      console.error("[Auth] Sign in error:", error);
      const errorMessage = error.message || "An error occurred during sign in. Please try again.";
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };
  
  // Log out user
  const logout = async () => {
    try {
      console.log("[Auth] Logging out user");
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      setAuthState({ 
        user: null, 
        loading: false, 
        error: null 
      });
      
      console.log("[Auth] Logout completed successfully");
    } catch (error: any) {
      console.error("[Auth] Logout error:", error);
      const errorMessage = error.message || "Error signing out";
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (data: Partial<UserData>) => {
    try {
      if (!authState.user) {
        throw new Error('No user logged in');
      }
      
      console.log("[Auth] Updating user profile for:", authState.user.email);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Update in Firestore
      const userRef = doc(db, 'Users', authState.user.email);
      await updateDoc(userRef, data);
      
      // Get updated user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as UserData;
      
      // Remove password from userData before storing in state
      const { password: _, ...userDataWithoutPassword } = userData;
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
      
      setAuthState({
        user: userDataWithoutPassword,
        loading: false,
        error: null
      });
      
      console.log("[Auth] User profile updated successfully");
    } catch (error: any) {
      console.error("[Auth] Update profile error:", error);
      const errorMessage = error.message || "Error updating profile";
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };
  
  // Add product to user's products array
  const addProductToUser = async (productId: string) => {
    try {
      if (!authState.user) {
        throw new Error('No user logged in');
      }
      
      console.log("[Auth] Adding product to user:", productId);
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Update in Firestore
      const userRef = doc(db, 'Users', authState.user.email);
      await updateDoc(userRef, {
        products: arrayUnion(productId)
      });
      
      // Get updated user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as UserData;
      
      // Remove password from userData before storing in state
      const { password: _, ...userDataWithoutPassword } = userData;
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
      
      setAuthState({
        user: userDataWithoutPassword,
        loading: false,
        error: null
      });
      
      console.log("[Auth] Product added to user successfully");
    } catch (error: any) {
      console.error("[Auth] Add product error:", error);
      const errorMessage = error.message || "Error adding product to user";
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };
  
  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    addProductToUser,
    isLoggedIn: !!authState.user,
    isAdmin: authState.user?.role === 'admin'
  };
}; 