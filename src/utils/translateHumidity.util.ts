import { HumidityValue } from '@/enums';

export const translateHumidity = (value?: string | null) => {
  if (!value) return '';

  switch (value) {
    case HumidityValue.HIGH:
      return 'Alta';
    case HumidityValue.NORMAL:
      return 'Normal';
    case HumidityValue.LOW:
      return 'Baja';
    default:
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
