import Script from 'next/script';
import React from 'react';
import type { StructuredDataProps } from './types';

/**
 * Componente para agregar datos estructurados JSON-LD para SEO
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
