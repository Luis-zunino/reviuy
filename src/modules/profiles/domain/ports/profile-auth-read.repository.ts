import type { GetSessionOutput, VerifyAuthenticationOutput } from '../contracts/profile-auth.types';

export interface ProfileAuthReadRepository {
  verifyAuthentication(): Promise<VerifyAuthenticationOutput>;
  getSession(): Promise<GetSessionOutput>;
}
