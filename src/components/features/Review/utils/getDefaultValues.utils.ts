import { ReviewWithRelations } from '@/types';
import { FormReviewSchema } from '../constants';
import { normalizeNullable } from '@/utils';
import { PropertyType } from '@/enums';

export const getDefaultValues = (
  defaultValues?: ReviewWithRelations | null
): FormReviewSchema | undefined => {
  if (!defaultValues) return undefined;
  const normalizedValues = normalizeNullable<ReviewWithRelations>(defaultValues);

  return {
    ...normalizedValues,
    property_type: normalizedValues.property_type ?? PropertyType.HOUSE,
    apartment_number: normalizedValues.apartment_number ?? '',
    osm_id: normalizedValues.address_osm_id ?? '',
    osm_type: '',
    address_text: normalizedValues.address_text ?? '',
    latitude: String(normalizedValues.latitude ?? ''),
    longitude: String(normalizedValues.longitude ?? 0),
    zone_rating: normalizedValues.zone_rating ?? 0,
    winter_comfort: normalizedValues.winter_comfort ?? '',
    summer_comfort: normalizedValues.summer_comfort ?? '',
    humidity: normalizedValues.humidity ?? '',
    real_estate_id: normalizedValues.real_estate_id ?? undefined,
    real_estate_name: normalizedValues.real_estates?.name ?? undefined,
    real_estate_experience: normalizedValues.real_estate_experience ?? '',
    review_rooms:
      normalizedValues.review_rooms?.map((room) => ({
        id: room.id,
        room_type: room.room_type || 'bedroom',
        area_m2: room.area_m2 || 0,
      })) || [],
  };
};
