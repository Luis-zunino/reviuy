import type { NominatimByOsmId, NominatimEntity } from '@/types';

export interface SearchAddressByNameInput {
  query: string;
  limit?: number;
  countrycodes?: string;
}

export type SearchAddressByNameOutput = NominatimEntity[];

export interface GetAddressInfoInput {
  osmId: string;
}

export type GetAddressInfoOutput = NominatimByOsmId[];
