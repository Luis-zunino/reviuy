import { USER_KEYS } from '@/services/constants';
import { AuthError } from '@supabase/supabase-js';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { createVerifyAuthenticationQuery } from '@/modules/profiles/application';
import { SupabaseProfileAuthReadRepository } from '@/modules/profiles/infrastructure';
import type { VerifyAuthenticationOutput } from '@/modules/profiles/domain';

const profileAuthReadRepository = new SupabaseProfileAuthReadRepository();
const verifyAuthentication = createVerifyAuthenticationQuery({
  profileAuthReadRepository,
});

export type VerifyAuthenticationResponse = VerifyAuthenticationOutput;

export const useVerifyAuthentication = (): UseQueryResult<
  VerifyAuthenticationResponse,
  AuthError | null
> => {
  return useQuery({
    queryKey: [USER_KEYS.useVerifyAuthentication],
    queryFn: () => verifyAuthentication({}),
  });
};
