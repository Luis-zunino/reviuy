import { describe, expect, it } from 'vitest';
import { normalizeNullable } from '../normalizeNullable.utils';

describe('normalizeNullable', () => {
  it('converts null values to undefined', () => {
    const result = normalizeNullable({ a: null, b: 'hello', c: 42 });
    expect(result).toEqual({ a: undefined, b: 'hello', c: 42 });
  });

  it('returns empty object for empty input', () => {
    expect(normalizeNullable({})).toEqual({});
  });

  it('preserves falsy non-null values', () => {
    const result = normalizeNullable({ a: 0, b: '', c: false });
    expect(result).toEqual({ a: 0, b: '', c: false });
  });

  it('preserves undefined values', () => {
    const result = normalizeNullable({ a: undefined, b: 'keep' });
    expect(result).toEqual({ a: undefined, b: 'keep' });
  });
});
