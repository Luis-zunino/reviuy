import { useApiMutation } from '@/shared/api';

export const useSendContactMessage = () =>
  useApiMutation('/api/contact');
