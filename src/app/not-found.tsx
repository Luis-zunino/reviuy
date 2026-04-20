import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <section className="max-w-lg w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm font-medium text-slate-500">Error 404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Pagina no encontrada</h1>
        <p className="mt-2 text-slate-600">La ruta que intentas abrir no existe o fue movida.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Ir al inicio
        </Link>
      </section>
    </main>
  );
}
