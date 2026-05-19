import { describe, expect, it } from 'vitest';
import { translateRoomType } from '../translateRoomType.util';
import { RoomType } from '@/enums';

describe('translateRoomType', () => {
  it('returns "Baño" for BATHROOM', () => {
    expect(translateRoomType(RoomType.BATHROOM)).toBe('Baño');
  });

  it('returns "Comedor" for DINING_ROOM', () => {
    expect(translateRoomType(RoomType.DINING_ROOM)).toBe('Comedor');
  });

  it('returns "Cocina" for KITCHEN', () => {
    expect(translateRoomType(RoomType.KITCHEN)).toBe('Cocina');
  });

  it('returns "Cuarto" for BEDROOM', () => {
    expect(translateRoomType(RoomType.BEDROOM)).toBe('Cuarto');
  });

  it('returns "Estudio" for STUDY', () => {
    expect(translateRoomType(RoomType.STUDY)).toBe('Estudio');
  });

  it('returns "Sala de estar" for LIVING_ROOM', () => {
    expect(translateRoomType(RoomType.LIVING_ROOM)).toBe('Sala de estar');
  });

  it('returns "Almacenamiento" for STORAGE', () => {
    expect(translateRoomType(RoomType.STORAGE)).toBe('Almacenamiento');
  });

  it('returns "-----" for unknown type', () => {
    expect(translateRoomType('unknown' as any)).toBe('-----');
  });

  it('returns empty string for null', () => {
    expect(translateRoomType(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(translateRoomType(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(translateRoomType('' as any)).toBe('');
  });
});
