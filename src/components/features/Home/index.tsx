import { Search, Star, Users } from 'lucide-react';
import { SearcherAddressHomeSection, Tips } from './components';
import { manrope, playfair } from '@/constants';

/**
 * Componente que muestra la landing principal
 * @returns {JSX.Element}
 */
export const Home = () => {
  return (
    <div className={`${manrope.className}  flex flex-col gap-10 pb-8`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-134 md:h-146 lg:h-156 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.22),transparent_40%),radial-gradient(circle_at_85%_18%,rgba(249,115,22,0.2),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_45%,#ffffff_100%)]" />

      <section className="relative overflow-hidden pt-6 md:pt-10 lg:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="landing-reveal ">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-reviuy-primary-200 bg-white/90 px-4 py-2 text-sm font-semibold text-reviuy-primary-700 shadow-sm">
              <span>✨ La comunidad de inquilinos de Uruguay</span>
            </div>

            <h1
              className={`${playfair.className} landing-reveal landing-delay-1 mb-5 text-4xl font-extrabold leading-[1.05] text-reviuy-gray-900 md:text-6xl`}
            >
              Encontrá tu próximo hogar
              <span className="block bg-linear-to-r from-reviuy-primary-700 to-reviuy-secondary-600 bg-clip-text text-transparent">
                con datos reales
              </span>
            </h1>

            <p className="landing-reveal landing-delay-2 mb-8 max-w-2xl text-base leading-relaxed text-reviuy-gray-700 md:text-xl">
              Mirá experiencias verificadas de inquilinos antes de firmar y evitá malas sorpresas.
            </p>

            <div className="landing-reveal landing-delay-2 rounded-2xl border border-reviuy-primary-100 bg-white/85 p-2 shadow-lg shadow-reviuy-primary-100/50 backdrop-blur-xs">
              <SearcherAddressHomeSection />
            </div>

            <p className="landing-reveal landing-delay-3 mt-4 text-sm font-medium text-reviuy-gray-600">
              Buscá por dirección y compará opiniones en segundos.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-reveal landing-delay-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-reviuy-gray-200 bg-white p-6 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <h2
              className={`${playfair.className} text-3xl font-bold text-reviuy-gray-900 md:text-4xl`}
            >
              Por qué ReviUy funciona
            </h2>
            <p className="mt-4 text-base leading-relaxed text-reviuy-gray-700 md:text-lg">
              Tomamos reseñas reales y las convertimos en una decisión clara para tu próximo
              alquiler.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-reviuy-primary-100 bg-white p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-reviuy-primary-50">
                <Search className="h-6 w-6 text-reviuy-primary-700" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-reviuy-gray-900">Buscá por dirección</h3>
              <p className="text-sm leading-relaxed text-reviuy-gray-600">
                Filtra por zona y ve experiencias reales de vecinos e inquilinos.
              </p>
            </div>

            <div className="rounded-2xl border border-reviuy-success-50 bg-white p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-reviuy-success-50">
                <Star className="h-6 w-6 text-reviuy-success-700" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-reviuy-gray-900">
                Evaluá antes de alquilar
              </h3>
              <p className="text-sm leading-relaxed text-reviuy-gray-600">
                Entendé el estado del inmueble, el trato del propietario y el contexto del barrio.
              </p>
            </div>

            <div className="rounded-2xl border border-reviuy-secondary-100 bg-white p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-reviuy-secondary-50">
                <Users className="h-6 w-6 text-reviuy-secondary-700" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-reviuy-gray-900">Compartí y protegé</h3>
              <p className="text-sm leading-relaxed text-reviuy-gray-600">
                Tu reseña ayuda a toda la comunidad a tomar decisiones más seguras.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Tips />
    </div>
  );
};
