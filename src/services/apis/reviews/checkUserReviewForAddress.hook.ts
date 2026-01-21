import { REVIEW_KEYS } from '@/services/constants';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { checkUserReviewForAddressApi } from './checkUserReviewForAddress.api';
import { CheckUserReviewForAddressParams, CheckUserReviewForAddressResponse } from './types';

export const useCheckUserReviewForAddress = (
  props: CheckUserReviewForAddressParams
): UseQueryResult<CheckUserReviewForAddressResponse | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.checkUserReviewForAddress, props.osmId, props.userId],
    enabled: Boolean(props.userId) && Boolean(props.osmId),
    queryFn: () => checkUserReviewForAddressApi(props),
  });
};
