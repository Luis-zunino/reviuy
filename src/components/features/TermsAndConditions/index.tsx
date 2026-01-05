import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import React from 'react';

export const TermsAndConditionsComponent = () => {
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={PagesUrls.HOME}>
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              icon={ArrowLeft}
              iconPosition="left"
            >
              Volver al inicio
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="text-gray-600 mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceptación de términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar Reviuy, aceptas estar sujeto a estos términos y condiciones. Si
              no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro
              servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Descripción del servicio
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Reviuy es una plataforma que permite a los usuarios crear y compartir reseñas sobre
              direcciones, propiedades y lugares. Los usuarios pueden buscar, leer y contribuir con
              reseñas para ayudar a otros en sus decisiones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Registro y cuenta de usuario
            </h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Debes proporcionar información veraz y actualizada</li>
              <li>Eres responsable de mantener la seguridad de tu cuenta</li>
              <li>No puedes compartir tu cuenta con terceros</li>
              <li>Debes notificarnos inmediatamente sobre cualquier uso no autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contenido del usuario</h2>
            <p className="text-gray-700 leading-relaxed">
              Las reseñas y contenido que publiques deben ser honestos, precisos y estar basados en
              tu experiencia real. Nos reservamos el derecho de moderar, editar o eliminar contenido
              que consideremos inapropiado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Conducta prohibida</h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Publicar contenido falso, difamatorio o engañoso</li>
              <li>Crear múltiples cuentas para manipular reseñas</li>
              <li>Usar el servicio para actividades ilegales</li>
              <li>Acosar o intimidar a otros usuarios</li>
              <li>Spam o promoción no autorizada</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Propiedad intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              El contenido original de Reviuy está protegido por derechos de autor. Al publicar
              contenido, nos otorgas una licencia para usar, mostrar y distribuir ese contenido en
              nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Limitación de responsabilidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Reviuy se proporciona &ldquo;tal como está&rdquo;. No garantizamos la exactitud del
              contenido de las reseñas y no somos responsables por decisiones tomadas basándose en
              la información de nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los
              cambios serán efectivos inmediatamente después de su publicación en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre estos términos, puedes contactarnos a través de los canales
              de soporte disponibles en la plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
