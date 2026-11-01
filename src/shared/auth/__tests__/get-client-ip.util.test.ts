import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockHeaderGet = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({ get: mockHeaderGet })),
}));

import { getClientIp } from '../get-client-ip.util';

describe('getClientIp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toma la primera IP de x-forwarded-for (lista client, proxy1, ...)', async () => {
    mockHeaderGet.mockImplementation((name: string) =>
      name === 'x-forwarded-for' ? '203.0.113.5, 10.0.0.1, 172.16.0.1' : null
    );

    await expect(getClientIp()).resolves.toBe('203.0.113.5');
  });

  it('usa x-real-ip como fallback cuando no hay x-forwarded-for', async () => {
    mockHeaderGet.mockImplementation((name: string) =>
      name === 'x-real-ip' ? '203.0.113.7' : null
    );

    await expect(getClientIp()).resolves.toBe('203.0.113.7');
  });

  it('devuelve unknown si no hay headers de IP', async () => {
    mockHeaderGet.mockReturnValue(null);

    await expect(getClientIp()).resolves.toBe('unknown');
  });
});
