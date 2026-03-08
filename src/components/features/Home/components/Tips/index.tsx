import { PagesUrls } from '@/enums';
import { cn } from '@/lib/utils';
import { tips } from '@/services/mocks/tips.mock';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

/**
 * Componente que muestra los tips de la landing
 * @returns {JSX.Element}
 */
export const Tips = () => {
  return (
    <section className="landing-reveal landing-delay-3 px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          'gap-4md:grid-cols-[1fr_220px_auto] overflow-hidden',
          'p-6 md:p-10 lg:mx-auto max-w-6xl',
          'bg-white border border-reviuy-gray-200 bg-[linear-gradient(120deg,#ffffff_10%,#fef7ee_46%,#eff6ff_100%)]  rounded-3xl shadow-sm '
        )}
      >
        <div className="md:flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-extrabold text-reviuy-gray-900 md:text-2xl">
              Te ayudamos a tomar la mejor decisión
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-reviuy-gray-700 md:text-base">
              Para una mejor experiencia
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 self-start rounded-full border border-reviuy-primary-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-reviuy-primary-700">
            <ShieldCheck className="h-4 w-4" />
            <Link
              title="Publicaciones del blog de ReviUy"
              href={PagesUrls.TIPS}
              className="max-w-fit mx-auto"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={PagesUrls.TIPS_DETAILS.replace(':id', tips[0].id)}
              className="rounded-lg p-6 border hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-semibold text-foreground mb-2">Evaluá la experiencia</h3>
              <p className="text-sm text-muted-foreground">
                Cómo revisar propiedades más allá de fotos: visitá el vecindario, hablá con actuales
                inquilinos
              </p>
            </Link>
            <Link
              href={PagesUrls.TIPS_DETAILS.replace(':id', tips[1].id)}
              className="rounded-lg p-6 border hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-foreground mb-2">Inmobiliarias confiables</h3>
              <p className="text-sm text-muted-foreground">
                Señales de una inmobiliaria seria: transparencia, respuesta rápida, sin presión
              </p>
            </Link>
            <Link
              href={PagesUrls.TIPS_DETAILS.replace(':id', tips[2].id)}
              className="rounded-lg p-6 border hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold text-foreground mb-2">Derechos del inquilino</h3>
              <p className="text-sm text-muted-foreground">
                Protegé tu experiencia: conocé tus derechos, cláusulas clave y garantías legales
              </p>
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2 self-start rounded-full border border-reviuy-primary-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-reviuy-primary-700 max-w-fit mx-auto mt-6">
            <ShieldCheck className="h-4 w-4" />
            <Link
              title="Publicaciones del blog de ReviUy"
              href={PagesUrls.TIPS}
              className="max-w-fit mx-auto"
            >
              Ver todos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
