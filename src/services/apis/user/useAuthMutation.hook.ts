import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { UseAuthMutationConfig } from './types';
import { useVerifyAuthentication } from './verifyAuthentication.hook';
import { toast } from 'sonner';

export const useAuthMutation = <TData, TError = Error, TVariables = void>(
  config: UseAuthMutationConfig<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  const {
    mutationFn,
    authErrorMessage = 'Debes iniciar sesión para realizar esta acción',
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

    return 'Ocurrió un error inesperado';
  };

  const shouldToastError = (mutationError: TError): boolean => {
    if (mutationError instanceof Error && mutationError.message.includes('NEXT_REDIRECT')) {
      return false;
    }

    return showErrorToast;
  };

  const authenticatedMutationFn = async (variables: TVariables): Promise<TData> => {
    if (error || !data?.userId) {
      toast.warning(authErrorMessage);
      throw new Error(authErrorMessage);
    }

    return mutationFn(variables);
  };

  return useMutation({
    mutationFn: authenticatedMutationFn,
    onError: (mutationError, variables, onMutateResult, context) => {
      if (shouldToastError(mutationError)) {
        toast.error(getErrorMessage(mutationError));
      }

      onError?.(mutationError, variables, onMutateResult, context);
    },
    ...mutationOptions,
  });
};
