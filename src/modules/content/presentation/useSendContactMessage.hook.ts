import { useAuthMutation } from '@/shared/auth';

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

type ContactResponse = {
  ok: true;
};

const sendContactMessage = async (payload: ContactPayload): Promise<ContactResponse> => {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo enviar el mensaje');
  }

  return data;
};

export const useSendContactMessage = () => {
  return useAuthMutation({
    mutationFn: sendContactMessage,
  });
};
