import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { verifyAuthentication } from './verifyAuthentication.api';
import type { UseAuthMutationConfig } from './types';

export const useAuthMutation = <TData, TError = Error, TVariables = unknown>(
  config: UseAuthMutationConfig<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  const {
    mutationFn,
    authErrorMessage = 'Debes iniciar sesión para realizar esta acción',
    ...mutationOptions
  } = config;

  const authenticatedMutationFn = async (variables: TVariables): Promise<TData> => {
    const authCheck = await verifyAuthentication();

    if (authCheck.error) {
      throw new Error(authErrorMessage) as TError;
    }

    return mutationFn({
      ...variables,
      user_id: authCheck?.data.user.id,
    });
  };

  return useMutation({
    mutationFn: authenticatedMutationFn,
    ...mutationOptions,
  });
};
