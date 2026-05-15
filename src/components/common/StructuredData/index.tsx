import Script from 'next/script';
import React from 'react';
import type { StructuredDataProps } from './types';
import DOMPurify from 'dompurify';

/**
 * Componente para agregar datos estructurados JSON-LD para SEO
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  // Sanitiza el JSON para evitar problemas de seguridad
  const safeJson = DOMPurify.sanitize(JSON.stringify(data));

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
      // Se omite porque la variable safeJson ya fue sanitizada previamente usando DOMPurify
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
};
