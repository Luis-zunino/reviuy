import { Search, Star, Users } from 'lucide-react';
import { Tips, SearcherAddressHomeSection, CreateReviewHomeSection } from './components';

export const Home = () => {
  return (
    <div className="flex flex-col gap-6 ">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none border-transparent bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 mb-8 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                ✨ La comunidad de inquilinos de Uruguay
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
              Encontrá tu lugar ideal con <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 animate-gradient">
                reseñas reales
              </span>
            </h1>
            <SearcherAddressHomeSection />
            <p className="text-xl md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed my-8">
              La primera plataforma donde podés conocer la experiencia de otros inquilinos antes de
              alquilar.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">¿Qué es ReviUy?</h2>
            <p className="text-lg text-gray-600 mx-auto">
              Somos una plataforma que te permite conocer la experiencia de otros inquilinos sobre
              propiedades y agencias inmobiliarias. Compartí tu experiencia y ayudá a otros a tomar
              mejores decisiones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Buscá propiedades</h3>
              <p className="text-gray-600">
                Ingresá la dirección o barrio que te interesa y conocé las reseñas de otros
                inquilinos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Leé reseñas reales</h3>
              <p className="text-gray-600">
                Conocé detalles sobre el estado del edificio, el barrio, los propietarios y más
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Compartí tu experiencia</h3>
              <p className="text-gray-600">
                Ayudá a otros dejando tu reseña sobre propiedades e inmobiliarias
              </p>
            </div>
          </div>
        </div>
      </section>
      <Tips />
      <CreateReviewHomeSection />
    </div>
  );
};
