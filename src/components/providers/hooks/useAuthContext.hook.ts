import { useContext } from 'react';
import { AuthContext } from '../constants';

/**
 * Hook to access the authentication context.
 * @returns AuthContextType - The authentication context.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
