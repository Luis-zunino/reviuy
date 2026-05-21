'use client';

import { useEffect, useRef } from 'react';
import type { StructuredDataProps } from './types';

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(data);
    }
  }, [data]);

  return <script id="structured-data" type="application/ld+json" ref={scriptRef} />;
};
