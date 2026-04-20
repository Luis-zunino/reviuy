import { useAuthMutation } from '@/shared/auth';

type ReportRealEstateMessagePayload = {
  reason: string;
  message: string;
  realEstateName: string;
};

type ReportRealEstateMessageResponse = {
  ok: true;
};

const sendReportRealEstateMessage = async (
  payload: ReportRealEstateMessagePayload
): Promise<ReportRealEstateMessageResponse> => {
  const res = await fetch('/api/report-real-estate', {
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

export const useSendReportRealEstateMessage = () => {
  return useAuthMutation({
    mutationFn: sendReportRealEstateMessage,
  });
};
