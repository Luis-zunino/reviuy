import Script from 'next/script';

interface BaseStructuredData {
  '@context': 'https://schema.org';
  '@type': string;
}

interface ReviewSchema extends BaseStructuredData {
  '@type': 'Review';
  itemReviewed: {
    '@type': 'Place' | 'Residence';
    name: string;
    address?: {
      '@type': 'PostalAddress';
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  };
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  datePublished: string;
  reviewBody?: string;
}

interface LocalBusinessSchema extends BaseStructuredData {
  '@type': 'LocalBusiness' | 'RealEstateAgent';
  name: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  url?: string;
  image?: string | string[];
}

interface BreadcrumbListSchema extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface WebSiteSchema extends BaseStructuredData {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

type StructuredDataSchema =
  | ReviewSchema
  | LocalBusinessSchema
  | BreadcrumbListSchema
  | WebSiteSchema;

interface StructuredDataProps {
  data: StructuredDataSchema | StructuredDataSchema[];
}

/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data for SEO purposes.
 * Supports multiple Schema.org types: Review, LocalBusiness, BreadcrumbList, WebSite
 *
 * @example
 * ```tsx
 * <StructuredData
 *   data={{
 *     "@context": "https://schema.org",
 *     "@type": "Review",
 *     itemReviewed: {
 *       "@type": "Residence",
 *       name: "Apartamento en Pocitos"
 *     },
 *     author: { "@type": "Person", name: "Juan Pérez" },
 *     reviewRating: { "@type": "Rating", ratingValue: 4.5 },
 *     datePublished: "2024-01-15"
 *   }}
 * />
 * ```
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((schema, index) => {
        // Escapar </script> y <!-- para prevenir XSS en bloques JSON-LD
        const safeJson = JSON.stringify(schema, null, 2)
          .replace(/</g, '\\u003c')
          .replace(/>/g, '\\u003e');

        return (
          <Script
            key={`structured-data-${schema['@type']}-${index}`}
            id={`structured-data-${schema['@type']}-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJson,
            }}
          />
        );
      })}
    </>
  );
}

// Helper functions to create structured data

export const createReviewSchema = ({
  propertyName,
  propertyAddress,
  authorName,
  rating,
  datePublished,
  reviewBody,
}: {
  propertyName: string;
  propertyAddress?: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  authorName: string;
  rating: number;
  datePublished: string;
  reviewBody?: string;
}): ReviewSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Residence',
    name: propertyName,
    ...(propertyAddress && {
      address: {
        '@type': 'PostalAddress',
        ...(propertyAddress.street && { streetAddress: propertyAddress.street }),
        ...(propertyAddress.city && { addressLocality: propertyAddress.city }),
        ...(propertyAddress.region && { addressRegion: propertyAddress.region }),
        ...(propertyAddress.country && { addressCountry: propertyAddress.country }),
      },
    }),
  },
  author: {
    '@type': 'Person',
    name: authorName,
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: rating,
    bestRating: 5,
    worstRating: 1,
  },
  datePublished,
  ...(reviewBody && { reviewBody }),
});

export const createLocalBusinessSchema = ({
  name,
  address,
  coordinates,
  aggregateRating,
  url,
  images,
}: {
  name: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
  };
  coordinates?: { latitude: number; longitude: number };
  aggregateRating?: { ratingValue: number; reviewCount: number };
  url?: string;
  images?: string | string[];
}): LocalBusinessSchema => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.region,
    addressCountry: address.country,
  },
  ...(coordinates && {
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  }),
  ...(aggregateRating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }),
  ...(url && { url }),
  ...(images && { image: images }),
});

export const createBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url?: string }>
): BreadcrumbListSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: breadcrumb.name,
    ...(breadcrumb.url && { item: breadcrumb.url }),
  })),
});

export const createWebSiteSchema = ({
  name,
  url,
  searchUrl,
}: {
  name: string;
  url: string;
  searchUrl?: string;
}): WebSiteSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  url,
  ...(searchUrl && {
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }),
});
