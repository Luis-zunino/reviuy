import { Metadata } from 'next';
import type { PageMetadataProps } from './types';
import { getSiteOrigin } from './site-url';

const siteUrl = getSiteOrigin();

/**
 * Genera metadata optimizado para SEO para páginas específicas
 */
export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = '/og-image.png',
  noIndex = false,
}: PageMetadataProps): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    keywords: [
      'reseñas propiedades uruguay',
      'alquiler uruguay',
      'inmobiliarias uruguay',
      ...keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'ReviUy',
      locale: 'es_UY',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@reviuy',
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
