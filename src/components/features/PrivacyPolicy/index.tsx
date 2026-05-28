import { PageWithSidebar } from '@/components/common';
import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_ADDRESS } from '@/constants/company.constant';

export const PrivacyPolicyComponent = () => {
  return (
    <PageWithSidebar
      title="Política de privacidad"
      description="Última actualización: 21 de mayo de 2026"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Información que recolectamos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En {COMPANY_NAME}, minimizamos la recolección de datos al máximo. Solo solicitamos la
              información estrictamente necesaria para brindar el servicio:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6 mt-2">
              <li>
                <strong>Correo electrónico:</strong> Lo utilizamos para crear tu perfil, autenticar
                tu acceso y enviarte comunicaciones del sistema (verificación de cuenta).
              </li>
              <li>
                <strong>Contenido del usuario:</strong> Las reseñas y calificaciones que elijas
                compartir se publican en la plataforma para que otros usuarios puedan consultarlas.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Datos del responsable</h2>
            <p className="text-gray-700 leading-relaxed">
              El responsable del tratamiento de tus datos personales es {COMPANY_NAME}, con
              domicilio en {COMPANY_ADDRESS}. Para cualquier consulta relacionada con tus datos,
              podés contactarnos a través del correo electrónico{' '}
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-blue-600 hover:underline">
                {COMPANY_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Base legal para el tratamiento
            </h2>
            <p className="text-gray-700 leading-relaxed">
              La base legal principal para el tratamiento de tus datos personales es tu{' '}
              <strong>consentimiento explícito</strong>. Al registrarte y utilizar la plataforma,
              aceptás esta política de privacidad y nos otorgás tu consentimiento para tratar tus
              datos conforme a lo aquí descrito, de acuerdo con la Ley Nº 18.331 de Uruguay.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos únicamente cookies técnicas esenciales. Estas son necesarias para que
              puedas mantener tu sesión iniciada. Al no usar servicios de analítica, no rastreamos
              tu actividad fuera de {COMPANY_NAME}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Procesadores externos</h2>
            <p className="text-gray-700 leading-relaxed">
              Para operar la plataforma, utilizamos los siguientes procesadores de datos que actúan
              en nuestro nombre:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6 mt-2">
              <li>
                <strong>Resend:</strong> utilizado para el envío de correos electrónicos del sistema
                (verificación de cuenta, notificaciones).
              </li>
              <li>
                <strong>Supabase:</strong> utilizado como infraestructura de base de datos y
                autenticación. Tus datos se almacenan de forma segura en sus servidores.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Transferencias internacionales de datos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Tanto Resend como Supabase pueden almacenar y procesar datos fuera de Uruguay. Ambas
              plataformas cumplen con estándares internacionales de protección de datos y adoptan
              garantías adecuadas (como cláusulas contractuales tipo) para asegurar un nivel de
              protección equivalente al exigido por la normativa uruguaya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Retención de datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Conservamos tus datos personales mientras mantengas una cuenta activa en{' '}
              {COMPANY_NAME}. Si solicitás la eliminación de tu cuenta, tus datos personales serán
              eliminados en un plazo máximo de 5 días hábiles. Las reseñas que hayas publicado
              podrán conservarse de forma anonimizada para mantener la integridad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Medidas de seguridad</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos las siguientes medidas técnicas y organizativas para proteger tus datos:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6 mt-2">
              <li>
                <strong>Cifrado en tránsito (TLS):</strong> toda la comunicación entre tu navegador
                y nuestros servidores está cifrada.
              </li>
              <li>
                <strong>Cifrado en reposo:</strong> los datos almacenados en Supabase están cifrados
                a nivel de disco.
              </li>
              <li>
                <strong>Row Level Security (RLS):</strong> implementamos políticas de acceso a nivel
                de fila en la base de datos para garantizar que cada usuario solo acceda a la
                información que le corresponde.
              </li>
              <li>
                <strong>Control de acceso:</strong> el acceso a la infraestructura está restringido
                al equipo de desarrollo autorizado.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Derechos ARCO</h2>
            <p className="text-gray-700 leading-relaxed">
              De acuerdo con la Ley Nº 18.331 de Uruguay, tenés los siguientes derechos sobre tus
              datos personales:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6 mt-2">
              <li>
                <strong>Acceso:</strong> solicitarnos información sobre qué datos personales tenemos
                tuyos.
              </li>
              <li>
                <strong>Rectificación:</strong> solicitar la corrección de datos inexactos o
                desactualizados.
              </li>
              <li>
                <strong>Cancelación (supresión):</strong> solicitar la eliminación de tus datos
                personales.
              </li>
              <li>
                <strong>Oposición:</strong> oponerte al tratamiento de tus datos para fines
                específicos.
              </li>
              <li>
                <strong>Portabilidad:</strong> solicitar una copia de tus datos en un formato
                estructurado y de uso común.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Cómo ejercer tus derechos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Para ejercer cualquiera de tus derechos ARCO, enviános un correo electrónico a{' '}
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-blue-600 hover:underline">
                {COMPANY_EMAIL}
              </a>{' '}
              indicando tu nombre y el derecho que deseás ejercer. Responderemos a tu solicitud en
              un plazo máximo de <strong>5 días hábiles</strong>, sin costo alguno.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Cambios a esta política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nos comprometemos a notificarte cualquier cambio material en esta política de
              privacidad a través del correo electrónico asociado a tu cuenta o mediante un aviso en
              la plataforma. La fecha de la última actualización se indica al inicio de esta
              política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Menores de edad</h2>
            <p className="text-gray-700 leading-relaxed">
              {COMPANY_NAME} no está dirigido a menores de 14 años. No recolectamos intencionalmente
              datos personales de menores de esa edad. Si tomamos conocimiento de que un menor de 14
              años nos ha proporcionado datos personales, procederemos a eliminarlos de forma
              inmediata.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              13. Unidad Reguladora y de Control de Datos Personales (URCDP)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si considerás que tus derechos no fueron atendidos adecuadamente, tenés derecho a
              presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales
              (URCDP), el organismo de control en materia de protección de datos personales en
              Uruguay.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tenés preguntas, comentarios o inquietudes sobre esta política de privacidad o
              sobre el tratamiento de tus datos personales, no dudes en contactarnos a través de{' '}
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-blue-600 hover:underline">
                {COMPANY_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageWithSidebar>
  );
};
