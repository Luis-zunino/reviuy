import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useVerifyAuthentication } from '@/modules/profiles/presentation';
import type { UseAuthMutationConfig } from './useAuthMutation.types';
import { ErrorMessages } from '@/lib/errors';
import { toast } from 'sonner';

export const useAuthMutation = <TData, TError = Error, TVariables = void>(
  config: UseAuthMutationConfig<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  const {
    mutationFn,
    authErrorMessage = ErrorMessages.UNAUTHORIZED,
    showErrorToast = true,
    errorToastMessage,
    onError,
    invalidateQueryKeys,
    onSuccess: callerOnSuccess,
    ...mutationOptions
  } = config;

  const queryClient = useQueryClient();
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
        toast.error(getErrorMessage(mutationError));
      }

      onError?.(mutationError, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, context) => {
      if (invalidateQueryKeys) {
        invalidateQueryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // TanStack v5 tipa onSuccess con 4 params (data, variables, onMutateResult, MutationFunctionContext).
      // Nuestro wrapper solo recibe 3, pasamos los que tenemos. JavaScript ignora los que sobran.
      (callerOnSuccess as (...args: unknown[]) => unknown)?.(data, variables, context);
    },
    ...mutationOptions,
  });
};
