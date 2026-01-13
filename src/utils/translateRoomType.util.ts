import { RoomType } from '@/enums';

export const translateRoomType = (value?: RoomType | null) => {
  if (!value) return '';

  switch (value) {
    case RoomType.BATHROOM:
      return 'Baño';
    case RoomType.DINING_ROOM:
      return 'Comedor';
    case RoomType.KITCHEN:
      return 'Cocina';
    case RoomType.BEDROOM:
      return 'Cuarto';
    case RoomType.STUDY:
      return 'Estudio';
    case RoomType.LIVING_ROOM:
      return 'Sala de estar';
    default:
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
