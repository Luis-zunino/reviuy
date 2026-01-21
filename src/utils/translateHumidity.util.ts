import { HumidityValue } from '@/enums';

export const translateHumidity = (value?: string | null) => {
  switch (value) {
    case HumidityValue.HIGH:
      return 'Alta';
    case HumidityValue.NORMAL:
      return 'Normal';
    case HumidityValue.LOW:
      return 'Baja';
    default:
      return '----';
  }
};
