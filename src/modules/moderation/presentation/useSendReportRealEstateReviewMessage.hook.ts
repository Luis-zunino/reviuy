import { useApiMutation } from '@/shared/api';

export const useSendReportRealEstateReviewMessage = () =>
  useApiMutation('/api/report-real-estate-review');
