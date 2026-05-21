'use client';

import { useEffect, useRef } from 'react';
import type { StructuredDataSchema } from './helpers';

interface StructuredDataProps {
  data: StructuredDataSchema | StructuredDataSchema[];
  nonce?: string;
}

export function StructuredData({ data }: Readonly<StructuredDataProps>) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((schema, index) => {
        const id = `structured-data-${schema['@type']}-${index}`;

        return <StructuredDataScript key={id} id={id} schema={schema} />;
      })}
    </>
  );
}

function StructuredDataScript({ id, schema }: { id: string; schema: StructuredDataSchema }) {
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(schema);
    }
  }, [schema]);

  return <script id={id} type="application/ld+json" ref={scriptRef} />;
}
