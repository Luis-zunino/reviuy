import { ACCENT_REMOVAL_PATTERN } from '@/constants';

export const normalizeSearchText = (value: string): string => {
  return value.normalize('NFD').replaceAll(ACCENT_REMOVAL_PATTERN, '').toLowerCase().trim();
};
