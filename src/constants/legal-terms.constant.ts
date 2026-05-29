/** Versión actual de términos — subí este número para forzar re-acceptance */
export const CURRENT_TERMS_VERSION = 'v2';

export const LEGAL_TERMS_TEXT = `1. Aceptación

Al acceder a ReviUy, aceptas estos términos. Si no estás de acuerdo con alguna parte, debes suspender el uso de la plataforma.

2. Propiedad Intelectual

El diseño, marca y código de ReviUy están protegidos por derechos de autor. Al publicar reseñas, nos otorgas una licencia gratuita para mostrar dicho contenido en nuestra plataforma, aunque tú sigues siendo el autor del mismo.

3. Limitación de Responsabilidad

ReviUy funciona como un tablón de anuncios comunitario. No garantizamos la veracidad de las reseñas publicadas por los usuarios. No somos responsables por decisiones económicas, legales o inmobiliarias tomadas basándose en el contenido del sitio.

4. Conducta Prohibida

- Publicar reseñas falsas o malintencionadas.
- Suplantar la identidad de otras personas o empresas.
- Intentar extraer datos de forma automatizada (scraping) sin autorización.

5. Ley Aplicable

Cualquier disputa relacionada con estos términos se resolverá bajo las leyes de la República Oriental del Uruguay, en los tribunales de la ciudad de Montevideo.

6. Responsabilidad Técnica y Fallas de Sistema

ReviUy no se responsabiliza por daños, perjuicios o pérdidas derivados de fallas en el sistema, en el servidor o en Internet. Asimismo, no garantizamos la ausencia de virus o elementos maliciosos introducidos por terceros que puedan producir alteraciones en tu equipo.

No seremos responsables por ataques de fraude informático de terceros (como "phishing") que utilicen nuestra marca de forma no autorizada. El uso de la plataforma y el acceso a enlaces externos corre por cuenta y riesgo exclusivo del usuario.`;

export interface LegalTermSectionData {
  number: string;
  title: string;
  paragraphs: string[];
  /** Optional list items for sections that use bullet points */
  listItems?: string[];
  /** Whether "strong" emphasis is needed on a specific part of first paragraph */
  strongText?: string;
}

export const LEGAL_TERMS_SECTIONS_DATA: LegalTermSectionData[] = [
  {
    number: '1.',
    title: 'Aceptación',
    paragraphs: [
      'Al acceder a ReviUy, aceptas estos términos. Si no estás de acuerdo con alguna parte, debes suspender el uso de la plataforma.',
    ],
  },
  {
    number: '2.',
    title: 'Propiedad Intelectual',
    paragraphs: [
      'El diseño, marca y código de ReviUy están protegidos por derechos de autor. Al publicar reseñas, nos otorgas una licencia gratuita para mostrar dicho contenido en nuestra plataforma, aunque tú sigues siendo el autor del mismo.',
    ],
  },
  {
    number: '3.',
    title: 'Limitación de Responsabilidad',
    paragraphs: [
      'ReviUy funciona como un tablón de anuncios comunitario. No garantizamos la veracidad de las reseñas publicadas por los usuarios. No somos responsables por decisiones económicas, legales o inmobiliarias tomadas basándose en el contenido del sitio.',
    ],
    strongText: 'No garantizamos la veracidad',
  },
  {
    number: '4.',
    title: 'Conducta Prohibida',
    paragraphs: [],
    listItems: [
      'Publicar reseñas falsas o malintencionadas.',
      'Suplantar la identidad de otras personas o empresas.',
      'Intentar extraer datos de forma automatizada (scraping) sin autorización.',
    ],
  },
  {
    number: '5.',
    title: 'Ley Aplicable',
    paragraphs: [
      'Cualquier disputa relacionada con estos términos se resolverá bajo las leyes de la República Oriental del Uruguay, en los tribunales de la ciudad de Montevideo.',
    ],
  },
  {
    number: '6.',
    title: 'Responsabilidad Técnica y Fallas de Sistema',
    paragraphs: [
      'ReviUy no se responsabiliza por daños, perjuicios o pérdidas derivados de fallas en el sistema, en el servidor o en Internet. Asimismo, no garantizamos la ausencia de virus o elementos maliciosos introducidos por terceros que puedan producir alteraciones en tu equipo.',
      'No seremos responsables por ataques de fraude informático de terceros (como "phishing") que utilicen nuestra marca de forma no autorizada. El uso de la plataforma y el acceso a enlaces externos corre por cuenta y riesgo exclusivo del usuario.',
    ],
  },
];

export const LEGAL_TERMS_SECTIONS = [
  { title: 'Aceptación de términos', description: 'Al usar ReviUy aceptas estos términos.' },
  {
    title: 'Propiedad Intelectual',
    description: 'El diseño y código están protegidos; tú conservas la autoría de tus reseñas.',
  },
  {
    title: 'Limitación de Responsabilidad',
    description:
      'ReviUy no garantiza la veracidad de las reseñas ni se responsabiliza por decisiones basadas en ellas.',
  },
  {
    title: 'Conducta Prohibida',
    description: 'No se permite publicar reseñas falsas, suplantar identidad ni hacer scraping.',
  },
  {
    title: 'Ley Aplicable',
    description: 'Cualquier disputa se resuelve bajo las leyes de Uruguay, en Montevideo.',
  },
  {
    title: 'Responsabilidad Técnica',
    description: 'No nos responsabilizamos por fallas del sistema, virus o ataques de terceros.',
  },
];
