import { CreateReviewData } from '@/services/apis/reviews/createReview.api';
import { FormReviewSchema } from '../constants';
import { getAddressOsmId } from '@/utils';

export const formatDataToBackend = (data: FormReviewSchema, userId: string): CreateReviewData => {
  const addressOsmId = getAddressOsmId({ osm_type: data.osm_type, osm_id: data.osm_id });

  return {
    user_id: userId,
    title: data.title,
    description: data.description,
    rating: data.rating,
    address_osm_id: addressOsmId,
    property_type: data.property_type,
    address_text: data.address_text,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    zone_rating: data.zone_rating,
    winter_comfort: data.winter_comfort,
    summer_comfort: data.summer_comfort,
    humidity: data.humidity,
    real_estate_id: data.real_estate_id,
    real_estate_experience: data.real_estate_experience,
    apartment_number: data.apartment_number,
    review_rooms: data.review_rooms?.map((room) => {
      return {
        id: room.id,
        room_type: room.room_type ?? null,
        area_m2: room.area_m2 ?? null,
      };
    }),
  };
};
