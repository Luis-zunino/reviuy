import Script from 'next/script';
import React from 'react';
import type { StructuredDataProps } from './types';

/**
 * Componente para agregar datos estructurados JSON-LD para SEO
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  // Escapar </script> y <!-- para prevenir XSS en bloques JSON-LD
  const safeJson = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
};
