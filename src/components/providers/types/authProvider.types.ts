export interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
