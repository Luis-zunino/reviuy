import { useAuthMutation } from '@/shared/auth';

type ReportRealEstateReviewMessagePayload = {
  reason: string;
  message: string;
  realEstateReviewUuid: string;
};

type ReportRealEstateMessageResponse = {
  ok: true;
};

const sendReportRealEstateReviewMessage = async (
  payload: ReportRealEstateReviewMessagePayload
): Promise<ReportRealEstateMessageResponse> => {
  const res = await fetch('/api/report-real-estate-review', {
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

export const useSendReportRealEstateReviewMessage = () => {
  return useAuthMutation({
    mutationFn: sendReportRealEstateReviewMessage,
  });
};
