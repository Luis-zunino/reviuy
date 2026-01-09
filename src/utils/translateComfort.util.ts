import { ComfortValue } from '@/enums';

export const translateComfort = (value?: string | null) => {
  if (!value) return '';

  switch (value) {
    case ComfortValue.HOT:
      return 'Caluroso';
    case ComfortValue.COLD:
      return 'Frío';
    case ComfortValue.MILD:
      return 'Templado';
    case ComfortValue.WARM:
      return 'Cálido';
    case ComfortValue.COOL:
      return 'Fresco';
    case ComfortValue.COMFORTABLE:
      return 'Cómodo';
    default:
      // fallback capitalize
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
