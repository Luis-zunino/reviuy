import { createError } from '@/lib/errors';

export async function assertAuthenticated(
  getCurrentUserId: () => Promise<string | null>,
  message?: string
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw createError('UNAUTHORIZED', message);
  }
  return userId;
}
