import { ACCENT_REMOVAL_PATTERN } from '@/constants/accent-removal-pattern.constant';

export const normalizeSearchText = (value: string): string => {
  return value.normalize('NFD').replaceAll(ACCENT_REMOVAL_PATTERN, '').toLowerCase().trim();
};
