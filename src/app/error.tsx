'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <main className="max-w-lg w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Algo salio mal</h1>
          <p className="mt-2 text-slate-600">
            Ocurrio un error inesperado. Puedes reintentar o volver al inicio.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
