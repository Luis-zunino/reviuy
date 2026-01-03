import type { ApiResponseError } from './types';

const isExceptionWithMessage = (
  exception: unknown
): exception is { content: { message: string } } => {
  if (
    typeof exception === 'object' &&
    exception &&
    'content' in exception &&
    exception.content &&
    typeof exception.content === 'object' &&
    'message' in exception.content &&
    typeof exception.content.message === 'string'
  ) {
    return true;
  }

  return false;
};

export const catchResponseError = (error: ApiResponseError | null) => {
  if (error?.content?.message) {
    return error.content.message;
  }

  if (isExceptionWithMessage(error?.exception)) {
    return error.exception.content.message;
  }
};
