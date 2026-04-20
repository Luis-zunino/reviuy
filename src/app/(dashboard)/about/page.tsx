import Link from 'next/link';
import { ArrowLeft, Target, Eye, Users, Heart, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Sobre Nosotros | ReviUy',
  description:
    'Conoce más sobre ReviUy, la plataforma de reseñas de alquileres en Uruguay. Nuestra misión, visión y equipo.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={PagesUrls.HOME} aria-label="Volver al inicio">
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              aria-label="Volver al inicio"
              icon={ArrowLeft}
              iconPosition="left"
            />
          </Link>
          <h1 className="text-4xl font-bold mb-2">Sobre Nosotros</h1>
          <p className="text-lg">Conoce más sobre ReviUy y nuestra misión</p>
        </div>

        {/* Hero Section */}
        <div className=" rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">¿Qué es ReviUy?</h2>
            <p className="text-lg leading-relaxed">
              ReviUy es la plataforma líder en Uruguay para compartir y descubrir experiencias
              reales sobre alquileres. Conectamos inquilinos y propietarios a través de reseñas
              honestas y transparentes, ayudando a tomar mejores decisiones.
            </p>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className=" rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold">Nuestra misión</h3>
            </div>
            <p className="leading-relaxed">
              Democratizar el acceso a información confiable sobre alquileres en Uruguay, creando
              una comunidad donde cada experiencia cuenta y ayuda a construir un mercado más justo y
              transparente.
            </p>
          </div>

          <div className=" rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold">Nuestra visión</h3>
            </div>
            <p className="leading-relaxed">
              Ser la plataforma de referencia en Uruguay para reseñas de alquileres, expandiendo
              nuestro impacto a toda Latinoamérica y ayudando a millones de personas a encontrar su
              hogar ideal.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className=" rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Nuestros valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transparencia</h3>
              <p className="text-sm">
                Creemos en la información clara y honesta para todos nuestros usuarios.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Comunidad</h3>
              <p className="text-sm">
                Fomentamos un espacio de ayuda mutua entre inquilinos y propietarios.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-3">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Empatía</h3>
              <p className="text-sm">
                Entendemos las necesidades de cada parte y buscamos soluciones justas.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-orange-100 rounded-full mb-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Innovación</h3>
              <p className="text-sm">
                Mejoramos constantemente para ofrecer la mejor experiencia posible.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-red-100 rounded-full mb-3">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seguridad</h3>
              <p className="text-sm">
                Protegemos los datos de nuestros usuarios con los más altos estándares.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-yellow-100 rounded-full mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compromiso</h3>
              <p className="text-sm">
                Dedicados a crear un impacto positivo en el mercado de alquileres.
              </p>
            </div>
          </div>
        </div>

        {/* Historia */}
        <div className=" rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Nuestra historia</h2>
          <div className="space-y-4 leading-relaxed">
            <p>
              ReviUy nació de la necesidad de crear un espacio donde inquilinos y propietarios
              pudieran compartir sus experiencias de forma honesta y constructiva. Vimos que muchas
              personas enfrentaban dificultades para encontrar información confiable sobre
              propiedades de alquiler en Uruguay.
            </p>
            <p>
              En 2024, decidimos crear una plataforma que democratizara el acceso a esta
              información, permitiendo que cada persona pudiera contribuir con su experiencia y
              beneficiarse de las experiencias de otros.
            </p>
            <p>
              Hoy, somos una comunidad en crecimiento que está transformando la manera en que las
              personas buscan y comparten información sobre alquileres en Uruguay.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para unirte a nuestra comunidad?</h2>
          <p className="text-lg mb-6 text-blue-100">
            Comparte tu experiencia y ayuda a otros a tomar mejores decisiones
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={PagesUrls.REVIEW_CREATE}>
              <Button size="lg" variant="outline">
                Crear una reseña
              </Button>
            </Link>
            <Link href={PagesUrls.HOME}>
              <Button size="lg" variant="outline">
                Explorar reseñas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
