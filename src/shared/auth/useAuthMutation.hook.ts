import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useVerifyAuthentication } from '@/modules/profiles/presentation';
import type { UseAuthMutationConfig } from './useAuthMutation.types';
import { ErrorMessages } from '@/lib';

export const useAuthMutation = <TData, TError = Error, TVariables = void>(
  config: UseAuthMutationConfig<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  const {
    mutationFn,
    authErrorMessage = ErrorMessages.UNAUTHORIZED,
    showErrorToast = true,
    errorToastMessage,
    onError,
    ...mutationOptions
  } = config;

  const { data, error } = useVerifyAuthentication();

  const getErrorMessage = (mutationError: TError): string => {
    if (typeof errorToastMessage === 'function') {
      return errorToastMessage(mutationError);
    }

    if (typeof errorToastMessage === 'string') {
      return errorToastMessage;
    }

    if (mutationError instanceof Error && mutationError.message) {
      return mutationError.message;
    }

    return ErrorMessages.UNKNOWN_ERROR;
  };

  const shouldToastError = (mutationError: TError): boolean => {
    if (mutationError instanceof Error && mutationError.message.includes('NEXT_REDIRECT')) {
      return false;
    }

    return showErrorToast;
  };

  const authenticatedMutationFn = async (variables: TVariables): Promise<TData> => {
    if (error || !data?.userId) {
      throw new Error(authErrorMessage);
    }

    return mutationFn(variables);
  };

  return useMutation({
    mutationFn: authenticatedMutationFn,
    onError: (mutationError, variables, onMutateResult, context) => {
      if (shouldToastError(mutationError)) {
        throw new Error(getErrorMessage(mutationError));
      }

      onError?.(mutationError, variables, onMutateResult, context);
    },
    ...mutationOptions,
  });
};
