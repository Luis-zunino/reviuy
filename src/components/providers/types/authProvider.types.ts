export interface TermsAcceptancePayload {
  acceptedTerms: boolean;
  termsAcceptedAt?: string;
  termsVersion?: string;
}

export interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, payload?: TermsAcceptancePayload) => Promise<void>;
  signInWithGoogle: (payload?: TermsAcceptancePayload) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
