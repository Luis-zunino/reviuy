import React from 'react';
import { PageWithSidebar } from '@/components/common';

export const TermsAndConditionsComponent = () => {
  return (
    <PageWithSidebar
      title="Términos y condiciones"
      description={`Última actualización: ${new Date().toLocaleDateString('es-ES')}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceptación</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder a ReviUy, aceptas estos términos. Si no estás de acuerdo con alguna parte,
              debes suspender el uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Propiedad Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              El diseño, marca y código de ReviUy están protegidos por derechos de autor. Al
              publicar reseñas, nos otorgas una licencia gratuita para mostrar dicho contenido en
              nuestra plataforma, aunque tú sigues siendo el autor del mismo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ReviUy funciona como un tablón de anuncios comunitario.{' '}
              <strong>No garantizamos la veracidad</strong>
              de las reseñas publicadas por los usuarios. No somos responsables por decisiones
              económicas, legales o inmobiliarias tomadas basándose en el contenido del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Conducta Prohibida</h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Publicar reseñas falsas o malintencionadas.</li>
              <li>Suplantar la identidad de otras personas o empresas.</li>
              <li>Intentar extraer datos de forma automatizada (scraping) sin autorización.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Ley Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Cualquier disputa relacionada con estos términos se resolverá bajo las leyes de la
              República Oriental del Uruguay, en los tribunales de la ciudad de Montevideo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Responsabilidad Técnica y Fallas de Sistema
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ReviUy no se responsabiliza por daños, perjuicios o pérdidas derivados de fallas en el
              sistema, en el servidor o en Internet. Asimismo, no garantizamos la ausencia de virus
              o elementos maliciosos introducidos por terceros que puedan producir alteraciones en
              tu equipo.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              No seremos responsables por ataques de fraude informático de terceros (como
              &quot phishing &quot) que utilicen nuestra marca de forma no autorizada. El uso de la plataforma
              y el acceso a enlaces externos corre por cuenta y riesgo exclusivo del usuario.
            </p>
          </section>
        </div>
      </div>
    </PageWithSidebar>
  );
};
