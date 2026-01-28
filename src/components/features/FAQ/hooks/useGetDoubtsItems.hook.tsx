import { PagesUrls } from '@/enums';
import { FAQCategory } from '../enums';
import type { FAQItem } from '../types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const useGetDoubtsItems = () => {
  const { push } = useRouter();
  const data: FAQItem[] = [
    {
      id: 1,
      category: FAQCategory.SEARCH,
      question: '¿Cómo busco propiedades en la plataforma?',
      answer: 'Puedes usar la barra de búsqueda en la página de inicio.',
      // answer:
      //   'Puedes usar la barra de búsqueda en la página de inicio para filtrar por ubicación, precio y otros criterios. También puedes explorar por barrios o usar filtros avanzados.',
    },
    {
      id: 2,
      category: FAQCategory.SEARCH,
      question: '¿Qué información proporcionan las reseñas?',
      answer:
        'Cada reseña incluye descripción, ubicación exacta, y opiniones de otros usuarios que han alquilado la propiedad.',
    },
    {
      id: 3,
      category: FAQCategory.REAL_ESTATE,
      question: '¿Cómo sé si una inmobiliaria es confiable?',
      answer:
        'Todas las inmobiliarias en nuestra plataforma tienen calificaciones y opiniones de usuarios. Revisa el historial y las opiniones antes de contactar.',
    },
    {
      id: 4,
      category: FAQCategory.RENTAL,
      question: '¿Cuál es el proceso de alquiler típico?',
      answer:
        'El proceso incluye: búsqueda de propiedad, contacto con la inmobiliaria, visita, negociación de términos, documentación y firma del contrato.',
    },
    {
      id: 6,
      category: FAQCategory.REVIEWS,
      question: '¿Cómo puedo dejar una opinión?',
      answer:
        'Después de alquilar una propiedad, puedes dejar una opinión con tu experiencia. Las opiniones ayudan a otros usuarios a tomar decisiones.',
    },

    {
      id: 7,
      question: '¿Qué es ReviUy?',
      answer:
        'Quienes hemos buscado donde vivir sabemos que hay poca información más allá de lo que prometen los anuncios. ReviUy te permite informarte de cómo es vivir en la propiedad que te interesa antes de mudarte, y compartir opiniones anónimas sobre los lugares donde has vivido. A través de la información, queremos convertir la jungla del alquiler en un espacio más justo y seguro, distinguiendo a quienes hacen las cosas bien',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 8,
      question: '¿Por qué dejar una opinión?',
      answer:
        'Al compartir tus experiencias sobre los lugares en los que has vivido, aumentas las posibilidades de que tanto tú como cualquier persona puedan encontrar una opinión de la propiedad que buscan. También de la escalera de vecinos y de la zona en la que quieres vivir.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 9,
      question: '¿Son anónimas mis opiniones?',
      answer:
        'Todas las opiniones son completamente anónimas. ReviUy nunca compartirá tu información personal. También se garantizará la intimidad y la protección de los datos del propietario del inmueble del que se da la opinión, en caso de ser un particular. Puedes leer más detalles en nuestra política de privacidad. Es posible que el propietario/a la lea. Esto es bueno, porque ReviUy quiere incentivar y reconocer las buenas prácticas. Pero si te preocupa, asegúrate de no compartir ningún dato que te pueda identificar.  Si tienes alguna duda, escríbenos.',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 11,
      question: '¿Por qué no encuentro la propiedad que busco?',
      answer:
        'Si la propiedad que buscas no se encuentra en ReviUy es porque quienes han vivido en él todavía no han dejado una opinión. Aun así, puedes ver la valoración del resto de vecinos y de la zona para tener información privilegiada del entorno. La plataforma funcionará en la medida en la que todos compartamos opiniones de las casas en las que hemos vivido. ¡Anima a los tuyos a dejar su opinión!',
      category: FAQCategory.REVIEWS,
    },
    {
      id: 13,
      question: '¿Cómo se verifican las opiniones?',
      answer:
        'Queremos que ReviUy proporcione contenido de calidad y fiable, pero es responsabilidad de los usuarios hacer un buen uso del portal. No es bienvenido el correo basura ni los mensajes que contengan lenguaje inapropiado, de acoso, discriminatorio o que incite al odio. Todas las personas tienen la posibilidad de reportarlo.',
      category: FAQCategory.OTHERS,
    },
    {
      id: 14,
      question:
        'Soy una inmobiliaria o el propietario de una vivienda en alquiler. ¿Puedo participar?',
      answer:
        'En la versión inicial de ReviUy, pueden participar las personas que viven o han vivido en las viviendas. En un futuro, el portal incorporará una nueva funcionalidad que permitirá a los propetarios e inmobiliarias participar también. Si quieres ponerte en contacto, escríbenos',
      category: FAQCategory.OTHERS,
    },

    {
      id: 15,
      question: '¿ReviUy brinda asesoramiento o soporte legal?',
      answer: (
        <>
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
          <Button variant="outline" onClick={() => push(PagesUrls.CONTACT)} className="mt-2">
            Contactar
          </Button>
        </>
      ),
      category: FAQCategory.OTHERS,
    },
  ];
  return { data };
};
