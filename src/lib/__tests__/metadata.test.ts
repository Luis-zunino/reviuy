import { describe, expect, it, beforeEach, vi } from 'vitest';
import { generatePageMetadata } from '../metadata';
import { getSiteOrigin } from '../site-url';

vi.mock('../site-url', () => ({
  getSiteOrigin: vi.fn(() => 'https://reviuy.vercel.app'),
}));

describe('generatePageMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    title: 'Test Page',
    description: 'Test description',
    path: '/test',
  };

  it('generates basic metadata with title and description', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.title).toBe('Test Page');
    expect(result.description).toBe('Test description');
  });

  it('sets canonical URL from path', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.alternates?.canonical).toBe('https://reviuy.vercel.app/test');
  });

  it('includes default keywords', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.keywords).toContain('reseñas propiedades uruguay');
    expect(result.keywords).toContain('alquiler uruguay');
    expect(result.keywords).toContain('inmobiliarias uruguay');
  });

  it('appends custom keywords to defaults', () => {
    const result = generatePageMetadata({
      ...baseProps,
      keywords: ['montevideo', 'casas'],
    });

    expect(result.keywords).toContain('montevideo');
    expect(result.keywords).toContain('casas');
  });

  it('sets Open Graph metadata', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.openGraph).toMatchObject({
      title: 'Test Page',
      description: 'Test description',
      url: 'https://reviuy.vercel.app/test',
      siteName: 'ReviUy',
      locale: 'es_UY',
      type: 'website',
    });
  });

  it('sets Twitter card metadata', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Test Page',
      description: 'Test description',
      creator: '@reviuy',
    });
  });

  it('allows overriding ogImage', () => {
    const result = generatePageMetadata({
      ...baseProps,
      ogImage: '/custom-og.png',
    });

    expect(result.openGraph?.images).toEqual([
      { url: '/custom-og.png', width: 1200, height: 630, alt: 'Test Page' },
    ]);
  });

  it('sets noIndex robots when noIndex is true', () => {
    const result = generatePageMetadata({
      ...baseProps,
      noIndex: true,
    });

    expect(result.robots).toEqual({ index: false, follow: true });
  });

  it('sets index robots by default', () => {
    const result = generatePageMetadata(baseProps);

    expect(result.robots).toEqual({ index: true, follow: true });
  });
});
