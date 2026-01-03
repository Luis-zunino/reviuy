import { Metadata } from 'next';
import type { PageMetadataProps } from './types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reviuy.vercel.app';

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
      siteName: 'RevieUy',
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

/**
 * Metadata para páginas de reseñas individuales
 */
export function generateReviewMetadata(review: {
  id: string;
  title: string;
  address_text: string;
  rating: number;
}): Metadata {
  return generatePageMetadata({
    title: `${review.title} - ${review.address_text}`,
    description: `Reseña de ${review.address_text}: ${review.title}. Calificación: ${review.rating}/5 estrellas. Lee más experiencias en RevieUy.`,
    path: `/review/details/${review.id}`,
    keywords: [review.address_text, 'reseña propiedad', review.title],
  });
}

/**
 * Metadata para páginas de inmobiliarias
 */
export function generateRealEstateMetadata(realEstate: {
  id: string;
  name: string;
  description?: string;
  average_rating?: number;
}): Metadata {
  const rating = realEstate.average_rating
    ? `Calificación promedio: ${realEstate.average_rating.toFixed(1)}/5`
    : 'Calificaciones de usuarios';

  return generatePageMetadata({
    title: `${realEstate.name} - Inmobiliaria`,
    description:
      realEstate.description ||
      `Lee reseñas y calificaciones de ${realEstate.name}. ${rating}. Descubre experiencias de otros usuarios en RevieUy.`,
    path: `/real-estate/${realEstate.id}`,
    keywords: [realEstate.name, 'inmobiliaria', 'reseñas inmobiliaria'],
  });
}

/**
 * Metadata para páginas de direcciones
 */
export function generateAddressMetadata(address: {
  display_name: string;
  osm_id: string;
}): Metadata {
  return generatePageMetadata({
    title: `${address.display_name} - Reseñas y Opiniones`,
    description: `Descubre reseñas y experiencias sobre ${address.display_name}. Lee opiniones de inquilinos y calificaciones detalladas en RevieUy.`,
    path: `/address/${address.osm_id}`,
    keywords: [address.display_name, 'reseñas dirección', 'opiniones alquiler'],
  });
}

/**
 * Schema.org structured data para reseñas
 */
export function generateReviewSchema(review: {
  id: string;
  title: string;
  description: string;
  rating: number;
  author_id: string;
  created_at: string;
  address_text: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Place',
      name: review.address_text,
    },
    author: {
      '@type': 'Person',
      '@id': review.author_id,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: review.title,
    reviewBody: review.description,
    datePublished: review.created_at,
  };
}

/**
 * Schema.org structured data para el sitio
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RevieUy',
    url: siteUrl,
    description: 'Plataforma de reseñas de propiedades de alquiler e inmobiliarias en Uruguay',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
