// src/hooks/useFirebaseAuth.ts
// ⚠️ DEPRECATED: This file is deprecated and will be removed in future releases.
// Use useFirestoreAuth.ts instead for authentication.
// This file is kept for reference and backward compatibility only.

import { useFirestoreAuth } from './useFirestoreAuth';

// Create a simple proxy to the new implementation that matches the old interface
export const useFirebaseAuth = () => {
  console.warn('[DEPRECATED] useFirebaseAuth is deprecated. Please use useFirestoreAuth instead.');
  
  const firestoreAuth = useFirestoreAuth();
  
  // Create a compatibility layer
  return {
    // Pass through all properties from firestoreAuth
    ...firestoreAuth,
    
    // Any additional methods needed for backward compatibility
    resetPassword: async (email: string) => {
      console.warn('[DEPRECATED] resetPassword is not implemented in the new auth system. Please contact support for password reset.');
      throw new Error('Password reset not implemented in the new auth system. Please contact support.');
    }
  };
};

// For backward compatibility, we'll provide the old function name as well
export const useFirebaseAuthOld = useFirebaseAuth;