export interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
