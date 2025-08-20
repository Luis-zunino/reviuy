import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

export type IWrappedMutationOptions<TData, TError, TVariables> = UseMutationOptions<
  TData,
  TError,
  TVariables
>;

export type IWrappedMutationResult<TData, TError, TVariables> = UseMutationResult<
  TData,
  TError,
  TVariables
>;

export type IWrappedQueryOptions<TQueryFnData, TError, TData> = UseQueryOptions<
  TQueryFnData,
  TError,
  TData
>;

export type IWrappedQueryResult<TData, TError> = UseQueryResult<TData, TError>;
