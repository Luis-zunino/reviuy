import { ComfortValue } from '@/enums';

export const translateComfort = (value?: string | null) => {
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
      return '----';
  }
};
