import { describe, expect, it } from 'vitest';
import { normalizeSearchText } from '../normalizeSearchText.util';

describe('normalizeSearchText', () => {
  it('removes accents from text', () => {
    expect(normalizeSearchText('café')).toBe('cafe');
  });

  it('lowercases text', () => {
    expect(normalizeSearchText('MONTEVIDEO')).toBe('montevideo');
  });

  it('trims whitespace', () => {
    expect(normalizeSearchText('  casa  ')).toBe('casa');
  });

  it('combines all transformations', () => {
    expect(normalizeSearchText('  Éxito  ')).toBe('exito');
  });

  it('handles text with multiple accents', () => {
    expect(normalizeSearchText('María José Hernández')).toBe('maria jose hernandez');
  });

  it('handles empty string', () => {
    expect(normalizeSearchText('')).toBe('');
  });
});
