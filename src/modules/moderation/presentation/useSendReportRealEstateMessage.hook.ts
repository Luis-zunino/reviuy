import { useApiMutation } from '@/shared/api';

export const useSendReportRealEstateMessage = () => useApiMutation('/api/report-real-estate');
