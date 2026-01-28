import { useAuthMutation } from '@/services';

type ReportReviewMessagePayload = {
  reason: string;
  message: string;
  reviewUuid: string;
};

type ReportMessageResponse = {
  ok: true;
};

const sendReportReviewMessage = async (
  payload: ReportReviewMessagePayload
): Promise<ReportMessageResponse> => {
  const res = await fetch('/api/report-review', {
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

export const useSendReportReviewMessage = () => {
  return useAuthMutation({
    mutationFn: sendReportReviewMessage,
  });
};
