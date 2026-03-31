import React from 'react';
import { PageWithSidebar } from '@/components/common';

export const PrivacyPolicyComponent = () => {
  return (
    <PageWithSidebar
      title="Política de privacidad"
      description={`Última actualización: ${new Date().toLocaleDateString('es-ES')}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg shadow-sm p-8 space-y-6">
          <h1 className="text-2xl font-bold mb-6">Política de Privacidad</h1>
          <p className="text-sm  italic">Última actualización: 12 de febrero de 2026</p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Información que recolectamos</h2>
            <p className=" leading-relaxed">
              En ReviUy, minimizamos la recolección de datos al máximo. Solo solicitamos:
            </p>
            <ul className=" leading-relaxed space-y-2 list-disc ml-6 mt-2">
              <li>
                <strong>Correo electrónico:</strong> Para crear tu perfil y autenticar tu acceso.
              </li>
              <li>
                <strong>Contenido del usuario:</strong> Las reseñas y calificaciones que elijas
                compartir.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Uso de herramientas de terceros</h2>
            <p className=" leading-relaxed">
              No utilizamos herramientas de rastreo ni análisis de comportamiento (como Google
              Analytics). Para el envío de correos electrónicos del sistema (verificación de
              cuenta), utilizamos <strong>Resend</strong>, quien actúa como procesador de datos bajo
              estándares de seguridad de alta confianza.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Cookies</h2>
            <p className=" leading-relaxed">
              Utilizamos únicamente cookies técnicas esenciales. Estas son necesarias para que
              puedas mantener tu sesión iniciada. Al no usar servicios de analítica, no rastreamos
              tu actividad fuera de ReviUy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Eliminación de datos</h2>
            <p className=" leading-relaxed">
              Tienes derecho a retirar tu consentimiento y solicitar la eliminación de tus datos en
              cualquier momento. Para ello, envía un correo a <strong>[TU_EMAIL_AQUÍ]</strong> y
              eliminaremos tu cuenta y registros asociados en un plazo máximo de 5 días hábiles,
              conforme a la Ley Nº 18.331 de Uruguay.
            </p>
          </section>
        </div>
      </div>
    </PageWithSidebar>
  );
};
