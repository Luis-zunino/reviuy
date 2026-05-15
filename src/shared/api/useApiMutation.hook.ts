import { useAuthMutation } from '@/shared/auth';

export const useApiMutation = <TPayload extends Record<string, unknown>>(
  endpoint: string,
  errorMessage?: string
) => {
  return useAuthMutation({
    mutationFn: async (payload: TPayload) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || errorMessage || 'No se pudo enviar el mensaje');
      }

      return data;
    },
  });
};
