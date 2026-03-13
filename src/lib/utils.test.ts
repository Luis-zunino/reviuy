import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('combina clases y elimina conflictos de Tailwind', () => {
    const result = cn('px-2', 'px-4', 'text-sm', 'text-base');

    expect(result).toContain('px-4');
    expect(result).toContain('text-base');
    expect(result).not.toContain('px-2');
    expect(result).not.toContain('text-sm');
  });
});
