import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import React from 'react';

export const GoodPracticesComponent = () => {
  return (
    <div className="min-h-screen bg-blue-50 py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900">Buenas Prácticas</h1>
          <p className="text-gray-600 mt-2">Guía para mantener una comunidad respetuosa y útil</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <p className="text-gray-700 leading-relaxed">
              Te damos la bienvenida a la plataforma Reviuy. En esta plataforma estás invitado a
              dejar comentarios y compartir opiniones con el resto de la comunidad sobre tu
              experiencia viviendo de alquiler. Por ello, es importante que conozcas las reglas que
              consideramos necesarias para garantizar una buena convivencia dentro de nuestra
              plataforma.
            </p>
          </section>

          <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Breve Resumen</h2>

            <h3 className="text-lg font-medium text-gray-800 mb-3">Comentarios prohibidos:</h3>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6 mb-4">
              <li>
                No está permitido introducir datos personales o información que pueda identificar
                directamente a una tercera persona sin su consentimiento.
              </li>
              <li>
                No se pueden hacer comentarios que puedan dañar los derechos al honor, intimidad o
                propia imagen de terceras personas.
              </li>
              <li>
                No se pueden realizar comentarios discriminatorios, homófobos, sexistas, racistas o
                cualquier comentario que incite al odio.
              </li>
              <li>
                No se puede incluir información con fines de spam, comunicaciones comerciales o que
                infrinja derechos de autor.
              </li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-4">
              Al publicar comentarios que no cumplan estas prohibiciones, estos podrán ser
              eliminados automáticamente o se realizará una ponderación de intereses para determinar
              si deben ser eliminados.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Comentarios de interés para la comunidad:
            </h3>

            <div className="mb-4">
              <p className="font-semibold text-gray-800 mb-2">Como inquilino de la vivienda:</p>
              <ul className="text-gray-700 leading-relaxed space-y-1 list-disc ml-6">
                <li>Tu experiencia general</li>
                <li>La convivencia con los vecinos</li>
                <li>Estado de la propiedad</li>
                <li>Trato con el propietario o inmobiliaria</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">Como propietario o inmobiliaria:</p>
              <ul className="text-gray-700 leading-relaxed space-y-1 list-disc ml-6">
                <li>Trato mantenido con los inquilinos</li>
                <li>Estado de la propiedad al finalizar el contrato</li>
                <li>Comportamiento de los inquilinos durante la residencia</li>
                <li>Características de la vivienda, zona y comodidades</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Qué Comentarios Están Prohibidos?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              El objetivo de Reviuy es que todos los usuarios puedan compartir sus experiencias
              sobre el período en el que han vivido de alquiler, tanto buenas como malas. Para
              evitar un mal uso de la plataforma, a continuación detallamos los tipos de comentarios
              prohibidos:
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              1. Datos Personales e Identificación de Terceros
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              No puedes publicar datos personales de terceros sin su consentimiento, ya que esto
              infringe la normativa de protección de datos. No se puede incluir:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Nombres completos, DNI, NIE o documentos de identidad</li>
              <li>Números de teléfono, direcciones de correo electrónico</li>
              <li>Direcciones completas o específicas</li>
              <li>Fotografías que identifiquen a personas sin su consentimiento</li>
              <li>Información bancaria o financiera</li>
              <li>Cualquier dato que permita identificar directamente a una persona</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              2. Respeto al Honor, Intimidad e Imagen
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Está prohibido realizar comentarios que atenten contra:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>El derecho al honor de terceras personas</li>
              <li>La intimidad personal y familiar</li>
              <li>La propia imagen de individuos</li>
              <li>Acusaciones falsas o difamatorias</li>
              <li>Revelación de información privada sin consentimiento</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">3. No Discriminación</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Se prohíbe estrictamente cualquier tipo de comentario que:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Sea discriminatorio por raza, etnia, nacionalidad u origen</li>
              <li>Contenga expresiones homófobas o transfóbicas</li>
              <li>Sea sexista o machista</li>
              <li>Discrimine por religión o creencias</li>
              <li>Incite al odio o la violencia contra cualquier grupo</li>
              <li>Contenga expresiones ofensivas basadas en características personales</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              4. Spam y Derechos de Propiedad Intelectual
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">No está permitido:</p>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Publicar spam o contenido repetitivo sin valor</li>
              <li>Incluir publicidad no autorizada</li>
              <li>Realizar comunicaciones comerciales no solicitadas</li>
              <li>Infringir derechos de autor o propiedad intelectual</li>
              <li>Copiar contenido de terceros sin autorización</li>
              <li>Incluir enlaces a sitios externos con fines comerciales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Consejos para Escribir Buenas Reseñas
            </h2>
            <ul className="text-gray-700 leading-relaxed space-y-2 list-disc ml-6">
              <li>Sé honesto y objetivo en tus comentarios</li>
              <li>Basa tus opiniones en experiencias reales y verificables</li>
              <li>Usa un lenguaje respetuoso y constructivo</li>
              <li>Proporciona detalles específicos que puedan ayudar a otros</li>
              <li>Evita generalizaciones o acusaciones sin fundamento</li>
              <li>Recuerda que tu reseña puede ayudar a otros a tomar decisiones</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Moderación de Contenido</h2>
            <p className="text-gray-700 leading-relaxed">
              El equipo de Reviuy se reserva el derecho de moderar, editar o eliminar cualquier
              contenido que viole estas buenas prácticas. En casos graves o reiterados, podremos
              suspender o cancelar cuentas de usuario. Estas normas pueden ser modificadas en
              cualquier momento, y los cambios serán notificados a los usuarios de forma explícita.
            </p>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">¿Tienes Dudas?</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas sobre estas buenas prácticas o necesitas reportar contenido
              inapropiado, no dudes en contactarnos. Estamos comprometidos en mantener Reviuy como
              una comunidad segura y útil para todos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
