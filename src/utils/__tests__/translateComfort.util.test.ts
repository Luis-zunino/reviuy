import { describe, expect, it } from 'vitest';
import { translateComfort } from '../translateComfort.util';
import { ComfortValue } from '@/enums/comfortType.enum';

describe('translateComfort', () => {
  it('returns "Caluroso" for HOT', () => {
    expect(translateComfort(ComfortValue.HOT)).toBe('Caluroso');
  });

  it('returns "Frío" for COLD', () => {
    expect(translateComfort(ComfortValue.COLD)).toBe('Frío');
  });

  it('returns "Templado" for MILD', () => {
    expect(translateComfort(ComfortValue.MILD)).toBe('Templado');
  });

  it('returns "Cálido" for WARM', () => {
    expect(translateComfort(ComfortValue.WARM)).toBe('Cálido');
  });

  it('returns "Fresco" for COOL', () => {
    expect(translateComfort(ComfortValue.COOL)).toBe('Fresco');
  });

  it('returns "Cómodo" for COMFORTABLE', () => {
    expect(translateComfort(ComfortValue.COMFORTABLE)).toBe('Cómodo');
  });

  it('returns "----" for unknown value', () => {
    expect(translateComfort('unknown')).toBe('----');
  });

  it('returns "----" for undefined', () => {
    expect(translateComfort(undefined)).toBe('----');
  });

  it('returns "----" for null', () => {
    expect(translateComfort(null)).toBe('----');
  });
});
