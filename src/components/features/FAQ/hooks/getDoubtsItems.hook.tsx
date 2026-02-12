import { PagesUrls } from '@/enums';
import { FAQCategory } from '../enums';
import type { FAQItem } from '../types';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export const getDoubtsItems = () => {
  const data: FAQItem[] = [
    {
      id: 1,
      category: FAQCategory.SEARCH,
      question: '¿Cómo busco propiedades en la plataforma?',
      answer: 'Puedes usar la barra de búsqueda en la página de inicio.',
    },
    {
      id: 2,
      category: FAQCategory.SEARCH,
      question: '¿Qué datos puedo ver en una reseña?',
      answer:
        'Las reseñas incluyen detalles sobre la vivienda, su ubicación exacta y las experiencias reales de personas que ya vivieron allí.',
    },
    {
      id: 3,
      category: FAQCategory.REAL_ESTATE,
      question: '¿Cómo puedo evaluar si una inmobiliaria es confiable?',
      answer:
        'En ReviUy, las inmobiliarias cuentan con calificaciones y comentarios de usuarios. Te recomendamos revisar sus valoraciones y el historial de opiniones antes de contactarlas.',
    },
    {
      id: 4,
      category: FAQCategory.RENTAL,
      question: '¿Cómo suele ser el proceso para alquilar una vivienda?',
      answer:
        'Generalmente el proceso comienza con la búsqueda, continúa con el contacto y la visita a la propiedad, y finaliza con la negociación, entrega de documentación y la firma del contrato.',
    },
    {
      id: 6,
      category: FAQCategory.REVIEWS,
      question: '¿Cómo puedo publicar una reseña?',
      answer:
        'Una vez que hayas alquilado una vivienda, podés compartir tu experiencia dejando una reseña. Tu opinión ayuda a que otras personas tomen mejores decisiones.',
    },
    {
      id: 7,
      question: '¿Qué es ReviUy y para qué sirve?',
      answer:
        'Buscar dónde vivir suele ser complicado y muchas veces la información disponible no refleja la realidad. ReviUy nace para cambiar eso: te permite conocer cómo es vivir en una propiedad antes de mudarte y compartir experiencias anónimas sobre los lugares donde viviste. Queremos hacer del alquiler un entorno más transparente, justo y seguro, destacando a quienes hacen las cosas bien.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 8,
      question: '¿Por qué es importante dejar una reseña?',
      answer:
        'Al contar tu experiencia, ayudás a que más personas puedan informarse sobre una vivienda, el edificio, los vecinos y la zona. Cuantas más reseñas haya, más útil se vuelve la plataforma para todos.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 9,
      question: '¿Mis reseñas son realmente anónimas?',
      answer:
        'Sí. Todas las opiniones en ReviUy son anónimas y nunca se comparte información personal. También se protege la privacidad de los propietarios, sean particulares o inmobiliarias. Es posible que el propietario lea la reseña, lo cual ayuda a fomentar buenas prácticas. De todas formas, evitá incluir datos que puedan identificarte. Para más información, podés consultar nuestra política de privacidad o contactarnos.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 11,
      question: '¿Por qué no aparece la vivienda que estoy buscando?',
      answer:
        'Si no encontrás una propiedad en ReviUy, es probable que nadie haya dejado aún una reseña sobre ella. Aun así, podés acceder a valoraciones del edificio, los vecinos o la zona. La plataforma crece gracias a que los usuarios comparten sus experiencias.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 13,
      question: '¿Cómo se controla la calidad de las opiniones?',
      answer:
        'ReviUy busca ofrecer información útil y confiable. Aunque las opiniones son responsabilidad de los usuarios, no se permite contenido ofensivo, discriminatorio, de acoso o spam. Cualquier usuario puede reportar una reseña que incumpla estas normas.',
      category: FAQCategory.OTHERS,
    },
    {
      id: 14,
      question: 'Soy propietario o inmobiliaria, ¿puedo formar parte de ReviUy?',
      answer:
        'En la primera versión de ReviUy, solo participan personas que viven o vivieron en las propiedades. Más adelante, se incorporarán funciones para que propietarios e inmobiliarias también puedan participar. Si te interesa, podés contactarnos.',
      category: FAQCategory.OTHERS,
    },

    {
      id: 15,
      question: '¿ReviUy brinda asesoramiento o soporte legal?',
      answer: (
        <div>
          <p>
            No. ReviUy no ofrece asesoramiento legal ni representación jurídica. La plataforma tiene
            como objetivo facilitar información, experiencias y valoraciones sobre inmuebles,
            propietarios, inmobiliarias y zonas, basándose en la opinión de los usuarios.
          </p>
          <p>
            Sin embargo, entendemos que en algunas situaciones —como conflictos contractuales, dudas
            legales o reclamos formales— puede ser necesario contar con apoyo profesional.Por ese
            motivo, podemos recomendar servicios de asesoría legal especializados, con el fin de
            orientar a los usuarios sobre los pasos a seguir.
          </p>
          <Button variant="outline" onClick={() => redirect(PagesUrls.CONTACT)} className="mt-2">
            Contactar
          </Button>
        </div>
      ),
      category: FAQCategory.OTHERS,
    },
  ];
  return { data };
};
