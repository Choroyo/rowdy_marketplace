// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestoreAuth } from '../hooks/useFirestoreAuth';

// AuthContext interface for Firestore-based auth
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  products: string[];
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  addProductToUser: (productId: string) => Promise<void>;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useFirestoreAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};