'use client';

import { PagesUrls } from '@/enums';
import { tips } from '@/services/mocks/tips.mock';
import Link from 'next/link';

export const Tips = () => {
  return (
    <section className="py-16 px-4 lg:mx-40 flex flex-col gap-6">
      <div className="flex flex-col align-center text-center justify-center mt-6 mb-14 ">
        <h2 className="xs:text-2xl">Te ayudamos a tomar la mejor decisión</h2>
        <h2 className="text-3xl font-bold text-foreground">Para una mejor experiencia</h2>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={PagesUrls.TIPS_DETAILS.replace(':id', tips[0].id)}
            className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="font-semibold text-foreground mb-2">Evalúa la experiencia</h3>
            <p className="text-sm text-muted-foreground">
              Cómo revisar propiedades más allá de fotos: visita el vecindario, habla con actuales
              inquilinos
            </p>
          </Link>
          <Link
            href={PagesUrls.TIPS_DETAILS.replace(':id', tips[1].id)}
            className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-foreground mb-2">Inmobiliarias confiables</h3>
            <p className="text-sm text-muted-foreground">
              Señales de una inmobiliaria seria: transparencia, respuesta rápida, sin presión
            </p>
          </Link>
          <Link
            href={PagesUrls.TIPS_DETAILS.replace(':id', tips[2].id)}
            className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-foreground mb-2">Derechos del inquilino</h3>
            <p className="text-sm text-muted-foreground">
              Protege tu experiencia: conoce tus derechos, cláusulas clave, garantías legales
            </p>
          </Link>
        </div>
      </div>
      <Link
        title="Publicaciones del blog de Reviu"
        href={PagesUrls.TIPS}
        className="max-w-fit mx-auto"
      >
        Ver todos
      </Link>
    </section>
  );
};
