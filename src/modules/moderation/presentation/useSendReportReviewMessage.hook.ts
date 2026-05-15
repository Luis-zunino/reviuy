import { useApiMutation } from '@/shared/api';

export const useSendReportReviewMessage = () => useApiMutation('/api/report-review');
