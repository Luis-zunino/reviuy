import { createContext } from 'react';
import { AuthContextType } from '../types';

/**
 * AuthContext is a React context that provides the authentication state and functions.
 */
export const AuthContext = createContext<AuthContextType>({
  userId: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  signOut: () => Promise.resolve(),
  signInWithEmail: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  isOwner: () => false,
});
