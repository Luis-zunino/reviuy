import { AppSession } from '@/services/apis/user/types';

export interface AuthContextType {
  userId: string | null;
  session: AppSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isOwner: (userId?: string | null) => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
