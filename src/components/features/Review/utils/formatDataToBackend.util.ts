import type { CreatePropertyReviewInput } from '@/modules/property-reviews';
import { FormReviewSchema } from '@/schemas';
import { getAddressOsmId } from '@/utils';

const normalizeOptionalText = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const normalizeOptionalUuid = (value?: string): string | null | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const formatDataToBackend = (data: FormReviewSchema): CreatePropertyReviewInput => {
  const addressOsmId = getAddressOsmId({ osm_type: data.osm_type, osm_id: data.osm_id });

  return {
    title: data.title,
    description: data.description,
    rating: data.rating,
    address_osm_id: addressOsmId,
    property_type: data.property_type,
    address_text: data.address_text,
    latitude: typeof data.latitude === 'string' ? Number(data.latitude) : data.latitude,
    longitude: typeof data.longitude === 'string' ? Number(data.longitude) : data.longitude,
    zone_rating: data.zone_rating,
    winter_comfort: normalizeOptionalText(data.winter_comfort),
    summer_comfort: normalizeOptionalText(data.summer_comfort),
    humidity: normalizeOptionalText(data.humidity),
    real_estate_id: normalizeOptionalUuid(data.real_estate_id),
    real_estate_experience: normalizeOptionalText(data.real_estate_experience),
    apartment_number: normalizeOptionalText(data.apartment_number),
    review_rooms: data.review_rooms?.map((room) => {
      return {
        room_type: room.room_type ?? null,
        area_m2: room.area_m2 ?? null,
      };
    }),
  };
};
