import { REVIEW_KEYS } from '@/constants/query-keys.constant';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase/client';
import {
  createCheckUserReviewForAddressQuery,
  SupabasePropertyReviewReadRepository,
} from '@/modules/property-reviews';
import { CheckUserReviewForAddressParams, CheckUserReviewForAddressResponse } from './types';

const propertyReviewReadRepository = new SupabasePropertyReviewReadRepository(supabaseClient);
const checkUserReviewForAddress = createCheckUserReviewForAddressQuery({
  propertyReviewReadRepository,
});

export const useCheckUserReviewForAddress = (
  props: CheckUserReviewForAddressParams
): UseQueryResult<CheckUserReviewForAddressResponse | null> => {
  return useQuery({
    queryKey: [REVIEW_KEYS.checkUserReviewForAddress, props.osmId],
    enabled: Boolean(props.osmId),
    queryFn: () => checkUserReviewForAddress({ osmId: props.osmId ?? '' }),
  });
};
