import { describe, expect, it, beforeEach, vi } from 'vitest';
import { getSiteOrigin, buildSiteUrl } from '../site-url';

describe('getSiteOrigin', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('returns default origin when env var is not set', () => {
    expect(getSiteOrigin()).toBe('https://reviuy.vercel.app');
  });

  it('returns the origin when env var is a valid URL', () => {
    expect(getSiteOrigin('https://reviuy.com/auth/callback')).toBe('https://reviuy.com');
  });

  it('returns default origin when env var is an invalid URL', () => {
    expect(getSiteOrigin('not-a-url')).toBe('https://reviuy.vercel.app');
  });

  it('returns default origin when env var is empty', () => {
    expect(getSiteOrigin('')).toBe('https://reviuy.vercel.app');
  });
});

describe('buildSiteUrl', () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('returns site origin when path is empty', () => {
    expect(buildSiteUrl()).toBe('https://reviuy.vercel.app');
  });

  it('builds full URL with path', () => {
    expect(buildSiteUrl('/about')).toBe('https://reviuy.vercel.app/about');
  });

  it('builds URL with custom site URL from env', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://custom.com');

    expect(buildSiteUrl('/test')).toBe('https://custom.com/test');
  });
});
