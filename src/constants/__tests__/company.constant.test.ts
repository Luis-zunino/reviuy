import { describe, expect, it } from 'vitest';
import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_ADDRESS } from '../company.constant';

describe('company.constant', () => {
  it('COMPANY_EMAIL debe ser un email válido de ReviUy', () => {
    expect(COMPANY_EMAIL).toBe('privacidad@reviuy.com');
  });

  it('COMPANY_NAME debe ser el nombre de la empresa', () => {
    expect(COMPANY_NAME).toBe('ReviUy');
  });

  it('COMPANY_ADDRESS debe ser una dirección en Uruguay', () => {
    expect(COMPANY_ADDRESS).toContain('Montevideo');
    expect(COMPANY_ADDRESS).toContain('Uruguay');
  });
});
