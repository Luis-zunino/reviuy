'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <main className="max-w-lg w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Error critico</h1>
          <p className="mt-2 text-slate-600">
            La aplicacion no pudo cargar correctamente. Reintenta o volve mas tarde.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
