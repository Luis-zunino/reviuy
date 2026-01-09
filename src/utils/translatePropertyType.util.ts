import { PropertyType } from '@/enums';

export const translatePropertyType = (value?: string | null) => {
  if (!value) return '';

  switch (value) {
    case PropertyType.APARTMENT:
      return 'Apartamento';
    case PropertyType.HOUSE:
      return 'Casa';
    case PropertyType.ROOM:
      return 'Habitación';
    default:
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
