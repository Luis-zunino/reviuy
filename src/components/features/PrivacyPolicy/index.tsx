import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import React from 'react';

export const PrivacyPolicyComponent = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="text-gray-600 mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Información que Recopilamos
            </h2>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800">Información de Cuenta</h3>
              <ul className="text-gray-700 leading-relaxed space-y-1 list-disc ml-6">
                <li>Dirección de correo electrónico</li>
                <li>Información de perfil que elijas compartir</li>
                <li>Historial de actividad en la plataforma</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">Información de Uso</h3>
              <ul className="text-gray-700 leading-relaxed space-y-1 list-disc ml-6">
                <li>Reseñas y comentarios que publiques</li>
                <li>Interacciones con otros usuarios</li>
                <li>Datos de navegación y uso de la plataforma</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Cómo Usamos tu Información
            </h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Personalizar tu experiencia en la plataforma</li>
              <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
              <li>Prevenir fraude y abuso</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Compartir Información</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              No vendemos tu información personal. Podemos compartir información en las siguientes
              circunstancias:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Con tu consentimiento explícito</li>
              <li>Para cumplir con requisitos legales</li>
              <li>Para proteger nuestros derechos y los de otros usuarios</li>
              <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Seguridad de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal contra acceso no autorizado, alteración, divulgación o
              destrucción. Utilizamos encriptación y otras tecnologías de seguridad estándar de la
              industria.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Retención de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Conservamos tu información personal mientras tu cuenta esté activa o según sea
              necesario para proporcionarte servicios. También podemos retener información para
              cumplir con obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Tus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">Tienes derecho a:</p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tu información</li>
              <li>Oponerte al procesamiento de tu información</li>
              <li>Solicitar la portabilidad de tus datos</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el
              uso de la plataforma y personalizar contenido. Puedes controlar las cookies a través
              de la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Menores de Edad</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestro servicio no está dirigido a menores de 13 años. No recopilamos conscientemente
              información personal de menores de 13 años. Si descubrimos que hemos recopilado
              información de un menor, la eliminaremos inmediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Cambios en esta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre
              cambios significativos publicando la nueva política en nuestra plataforma y
              actualizando la fecha de &ldquo;última actualización&rdquo;.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu
              información, puedes contactarnos a través de los canales de soporte disponibles en la
              plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
