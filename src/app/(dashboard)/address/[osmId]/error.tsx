'use client';

import Link from 'next/link';

export default function AddressError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Error al cargar la direccion
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          No pudimos obtener la informacion de esta direccion. Es posible que
          el recurso no exista o haya ocurrido un error temporal.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Reintentar
          </button>
          <Link
            href="/explorar"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
