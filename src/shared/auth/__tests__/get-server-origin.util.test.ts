import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockHeaderGet = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({ get: mockHeaderGet })),
}));

import { getServerOrigin } from '../get-server-origin.util';

describe('getServerOrigin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa x-forwarded-host y x-forwarded-proto cuando están presentes', async () => {
    mockHeaderGet.mockImplementation((name: string) => {
      if (name === 'x-forwarded-host') return 'preview-site.vercel.app';
      if (name === 'x-forwarded-proto') return 'https';
      if (name === 'host') return 'preview-site.vercel.app';
      return null;
    });

    await expect(getServerOrigin()).resolves.toBe('https://preview-site.vercel.app');
  });

  it('ignora valores múltiples de x-forwarded-proto y toma el primero', async () => {
    mockHeaderGet.mockImplementation((name: string) => {
      if (name === 'x-forwarded-host') return 'mysite.com';
      if (name === 'x-forwarded-proto') return 'https,http';
      if (name === 'host') return 'mysite.com';
      return null;
    });

    await expect(getServerOrigin()).resolves.toBe('https://mysite.com');
  });

  it('cae a host y http para localhost sin headers de proxy', async () => {
    mockHeaderGet.mockImplementation((name: string) =>
      name === 'host' ? 'localhost:3000' : null
    );

    await expect(getServerOrigin()).resolves.toBe('http://localhost:3000');
  });

  it('usa https para un host no local sin x-forwarded-proto', async () => {
    mockHeaderGet.mockImplementation((name: string) => (name === 'host' ? 'mysite.com' : null));

    await expect(getServerOrigin()).resolves.toBe('https://mysite.com');
  });

  it('cae a localhost:3000 cuando no hay ningún header', async () => {
    mockHeaderGet.mockReturnValue(null);

    await expect(getServerOrigin()).resolves.toBe('http://localhost:3000');
  });
});
