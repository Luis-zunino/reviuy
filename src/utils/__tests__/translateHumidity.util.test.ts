import { describe, expect, it } from 'vitest';
import { translateHumidity } from '../translateHumidity.util';
import { HumidityValue } from '@/enums/humidityValue.enum';

describe('translateHumidity', () => {
  it('returns "Alta" for HIGH', () => {
    expect(translateHumidity(HumidityValue.HIGH)).toBe('Alta');
  });

  it('returns "Normal" for NORMAL', () => {
    expect(translateHumidity(HumidityValue.NORMAL)).toBe('Normal');
  });

  it('returns "Baja" for LOW', () => {
    expect(translateHumidity(HumidityValue.LOW)).toBe('Baja');
  });

  it('returns "----" for unknown value', () => {
    expect(translateHumidity('unknown')).toBe('----');
  });

  it('returns "----" for undefined', () => {
    expect(translateHumidity(undefined)).toBe('----');
  });

  it('returns "----" for null', () => {
    expect(translateHumidity(null)).toBe('----');
  });
});
