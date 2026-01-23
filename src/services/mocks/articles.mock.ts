import type { Article } from '@/types';
import { ArticleType, ContentType } from '@/types';

export const articles: Article[] = [
  {
    id: 1,
    title: '10 Preguntas clave antes de firmar tu contrato de alquiler',
    excerpt:
      'Aprende qué debes preguntar y verificar antes de firmar cualquier contrato de alquiler para evitar sorpresas desagradables.',
    category: ArticleType.CONTRACTS,
    date: 'Nov 25, 2024',
    readTime: '8 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Firmar un contrato de alquiler es uno de los momentos más importantes cuando buscas una nueva vivienda. Este documento legal establecerá tus derechos y obligaciones durante todo el período de arrendamiento, por lo que es fundamental hacer las preguntas correctas antes de comprometerte. A continuación, te presentamos las 10 preguntas esenciales que debes hacer.',
        },
      ],
      // Pregunta 1
      [
        { type: ContentType.H2, text: '1. ¿Cuál es el monto total mensual y qué incluye?' },
        {
          type: ContentType.P,
          text: 'No te quedes solo con el precio de la renta. Pregunta específicamente:',
        },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '¿El precio incluye gastos comunes o expensas?' },
            {
              type: ContentType.LI,
              text: '¿Los servicios básicos (agua, luz, gas) están incluidos?',
            },
            { type: ContentType.LI, text: '¿Hay cargos adicionales por estacionamiento?' },
            {
              type: ContentType.LI,
              text: '¿Existe algún cargo por mantenimiento de áreas comunes?',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es importante: Muchos inquilinos descubren después de firmar que el costo real es significativamente mayor al precio inicialmente acordado.',
        },
      ],
      // Pregunta 2
      [
        {
          type: ContentType.H2,
          text: '2. ¿Cuál es la duración del contrato y las condiciones de renovación?',
        },
        { type: ContentType.P, text: 'Debes conocer:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Período mínimo de alquiler' },
            { type: ContentType.LI, text: 'Opciones de renovación automática' },
            { type: ContentType.LI, text: 'Procedimiento para extender el contrato' },
            { type: ContentType.LI, text: 'Penalizaciones por terminación anticipada' },
            { type: ContentType.LI, text: 'Período de aviso requerido para no renovar' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Consejo: Si planeas quedarte a largo plazo, negocia cláusulas de renovación favorables desde el principio.',
        },
      ],
      // Pregunta 3
      [
        {
          type: ContentType.H2,
          text: '3. ¿Qué depósito de garantía se requiere y cuándo se devuelve?',
        },
        { type: ContentType.P, text: 'Pregunta sobre:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Monto exacto del depósito (generalmente 1-2 meses de alquiler)',
            },
            { type: ContentType.LI, text: 'Condiciones para la devolución completa' },
            { type: ContentType.LI, text: 'Plazo para recibir la devolución después de mudarte' },
            { type: ContentType.LI, text: 'Procedimiento de inspección final' },
            {
              type: ContentType.LI,
              text: 'Qué se considera "daño normal por uso" vs. daños que descuentan del depósito',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Importante: Solicita que el procedimiento de inspección y devolución esté por escrito en el contrato.',
        },
      ],
      // Pregunta 4
      [
        {
          type: ContentType.H2,
          text: '4. ¿Quién es responsable de las reparaciones y mantenimiento?',
        },
        { type: ContentType.P, text: 'Clarifica:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Reparaciones mayores: ¿quién las cubre? (calefacción, plomería, estructura)',
            },
            {
              type: ContentType.LI,
              text: 'Mantenimiento regular: ¿quién lo realiza? (jardín, pintura, limpieza de canaletas)',
            },
            { type: ContentType.LI, text: 'Tiempo de respuesta para reparaciones urgentes' },
            { type: ContentType.LI, text: 'Proceso para reportar problemas' },
            {
              type: ContentType.LI,
              text: '¿Puedes contratar servicios por tu cuenta y deducirlos de la renta?',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Red flag: Si el propietario es vago o evasivo sobre responsabilidades de reparación, podrías enfrentar problemas más adelante.',
        },
      ],
      // Pregunta 5
      [
        { type: ContentType.H2, text: '5. ¿Existen restricciones sobre el uso de la propiedad?' },
        { type: ContentType.P, text: 'Verifica si hay limitaciones sobre:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Mascotas (tipo, tamaño, cantidad, depósito adicional)' },
            { type: ContentType.LI, text: 'Subarrendamiento o roommates' },
            {
              type: ContentType.LI,
              text: 'Modificaciones menores (pintar paredes, colgar cuadros, instalar estantes)',
            },
            { type: ContentType.LI, text: 'Actividades comerciales o trabajo desde casa' },
            { type: ContentType.LI, text: 'Horarios de ruido' },
            { type: ContentType.LI, text: 'Uso de áreas comunes' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Tip: Si tienes necesidades específicas (como tener mascotas), negocia estas condiciones antes de firmar.',
        },
      ],
      // Pregunta 6
      [
        { type: ContentType.H2, text: '6. ¿Cómo funcionan los aumentos de renta?' },
        { type: ContentType.P, text: 'Pregunta sobre:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: '¿Está permitido aumentar la renta durante el contrato vigente?',
            },
            { type: ContentType.LI, text: '¿Con qué frecuencia puede aumentar?' },
            { type: ContentType.LI, text: '¿Hay un tope máximo de aumento?' },
            { type: ContentType.LI, text: '¿Cuánto aviso se requiere antes de un aumento?' },
            { type: ContentType.LI, text: '¿El aumento está indexado a algún índice oficial?' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección: En muchos países existen leyes que limitan los aumentos de alquiler. Conoce tus derechos.',
        },
      ],
      // Pregunta 7
      [
        { type: ContentType.H2, text: '7. ¿Qué pasa en caso de emergencias?' },
        { type: ContentType.P, text: 'Asegúrate de conocer:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Información de contacto de emergencia del propietario o administrador',
            },
            {
              type: ContentType.LI,
              text: 'Protocolo para emergencias (fugas, incendios, problemas eléctricos)',
            },
            {
              type: ContentType.LI,
              text: '¿Existe un fondo de emergencia o seguro que cubra daños?',
            },
            {
              type: ContentType.LI,
              text: 'Ubicación de llaves de corte (agua, gas, electricidad)',
            },
            { type: ContentType.LI, text: 'Planes de evacuación del edificio' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Consejo: Guarda toda esta información en un lugar accesible desde el primer día.',
        },
      ],
      // Pregunta 8
      [
        { type: ContentType.H2, text: '8. ¿Cuáles son las reglas del edificio o comunidad?' },
        { type: ContentType.P, text: 'Si es un apartamento o condominio, pregunta sobre:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Reglamento interno del edificio' },
            { type: ContentType.LI, text: 'Normas de convivencia' },
            { type: ContentType.LI, text: 'Restricciones de horario para mudanzas o trabajos' },
            {
              type: ContentType.LI,
              text: 'Uso de instalaciones comunes (gimnasio, piscina, sala de reuniones)',
            },
            { type: ContentType.LI, text: 'Política de visitas y estacionamiento para invitados' },
            { type: ContentType.LI, text: 'Costos adicionales por uso de amenidades' },
          ],
        },
      ],
      // Pregunta 9
      [
        { type: ContentType.H2, text: '9. ¿Hay seguros requeridos?' },
        { type: ContentType.P, text: 'Clarifica:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '¿Se requiere seguro de inquilino?' },
            { type: ContentType.LI, text: '¿Qué cubre el seguro del propietario?' },
            {
              type: ContentType.LI,
              text: '¿Qué no está cubierto y deberías asegurar por tu cuenta?',
            },
            {
              type: ContentType.LI,
              text: '¿Existe cobertura por robo o daños a tus pertenencias?',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Recomendación: Aunque no sea obligatorio, considera obtener un seguro de inquilino para proteger tus bienes.',
        },
      ],
      // Pregunta 10
      [
        { type: ContentType.H2, text: '10. ¿Puedo ver el historial de la propiedad?' },
        { type: ContentType.P, text: 'No temas preguntar:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '¿Cuánto tiempo estuvo vacía la propiedad?' },
            { type: ContentType.LI, text: '¿Por qué se fue el inquilino anterior?' },
            {
              type: ContentType.LI,
              text: '¿Ha habido problemas recientes en el edificio? (inundaciones, plagas, robos)',
            },
            {
              type: ContentType.LI,
              text: '¿Se han realizado reparaciones importantes recientemente?',
            },
            {
              type: ContentType.LI,
              text: '¿Hay inspecciones o certificaciones de seguridad disponibles?',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Señal positiva: Un propietario transparente no tendrá problema en responder estas preguntas.',
        },
      ],
      // Lista de verificación
      [
        { type: ContentType.H2, text: 'Lista de verificación final antes de firmar' },
        { type: ContentType.P, text: 'Antes de poner tu firma en el contrato, asegúrate de:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Haber leído el contrato completo, incluyendo la letra pequeña',
            },
            { type: ContentType.LI, text: 'Entender todos los términos y condiciones' },
            {
              type: ContentType.LI,
              text: 'Haber recibido respuestas satisfactorias a todas estas preguntas',
            },
            { type: ContentType.LI, text: 'Tener por escrito cualquier acuerdo verbal' },
            {
              type: ContentType.LI,
              text: 'Haber inspeccionado la propiedad y documentado su estado actual con fotos',
            },
            { type: ContentType.LI, text: 'Tener copias de todos los documentos firmados' },
            {
              type: ContentType.LI,
              text: 'Verificar la identidad del propietario y su derecho a alquilar',
            },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Hacer estas preguntas no te hace un inquilino difícil, te hace un inquilino inteligente. Un propietario profesional y honesto esperará y apreciará que hagas preguntas detalladas. Si alguien se muestra molesto o evasivo ante estas preguntas básicas, considera eso como una señal de alerta.',
        },
        {
          type: ContentType.P,
          text: 'Recuerda: un contrato de alquiler es un compromiso legal serio. Invertir tiempo en hacer las preguntas correctas ahora puede ahorrarte problemas, dinero y estrés en el futuro.',
        },
        {
          type: ContentType.P,
          text: 'Próximos pasos: Una vez que hayas obtenido respuestas satisfactorias a estas preguntas, considera consultar el contrato con un abogado antes de firmar, especialmente si es tu primer alquiler o si algo en el contrato no te queda claro.',
        },
      ],
    ],
  },
  {
    id: 2,
    title: 'Presupuesto real: ¿Cuánto cuesta realmente alquilar?',
    excerpt:
      'Descubre todos los gastos asociados al alquiler más allá de la renta mensual: seguros, servicios, depósitos y más.',
    category: ArticleType.FINANCE,
    date: 'Nov 23, 2024',
    readTime: '6 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Cuando buscas una vivienda en alquiler, el precio mensual que ves anunciado es solo la punta del iceberg. Muchos inquilinos primerizos se sorprenden al descubrir que sus gastos reales son significativamente mayores a la cifra que esperaban pagar. En esta guía completa, desglosamos todos los costos asociados con el alquiler para que puedas crear un presupuesto realista y evitar sorpresas financieras.',
        },
      ],
      // La Renta Mensual Base
      [
        { type: ContentType.H2, text: 'La renta mensual base' },
        {
          type: ContentType.P,
          text: 'Este es el costo más obvio y generalmente el más grande. Sin embargo, es importante entender qué incluye y qué no:',
        },
        {
          type: ContentType.P,
          text: 'Renta estándar: El monto que pagas al propietario mensualmente por el uso de la vivienda.',
        },
        { type: ContentType.P, text: 'Variaciones comunes:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Puede aumentar anualmente según el contrato' },
            {
              type: ContentType.LI,
              text: 'Algunos propietarios ofrecen descuentos por pagos adelantados (3-6 meses)',
            },
            {
              type: ContentType.LI,
              text: 'En mercados competitivos, puedes negociar mejores tarifas con contratos más largos',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Tip financiero: Como regla general, tu renta no debería exceder el 30% de tus ingresos mensuales netos. Si supera este porcentaje, podrías tener dificultades para cubrir otros gastos.',
        },
      ],
      // Depósitos Iniciales
      [
        { type: ContentType.H2, text: 'Depósitos iniciales' },
        {
          type: ContentType.P,
          text: 'Antes de mudarte, necesitarás reunir una suma considerable de dinero:',
        },
        { type: ContentType.H3, text: 'Depósito de garantía' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Monto típico: 1-2 meses de renta' },
            { type: ContentType.LI, text: 'Propósito: Cubre daños más allá del desgaste normal' },
            {
              type: ContentType.LI,
              text: 'Recuperación: Se devuelve al final del contrato si la propiedad está en buen estado',
            },
            {
              type: ContentType.LI,
              text: 'Importante: No es un pago adicional, es dinero que recuperarás (idealmente)',
            },
          ],
        },
        { type: ContentType.H3, text: 'Primer y último mes' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Muchos propietarios requieren el primer y último mes de renta por adelantado',
            },
            {
              type: ContentType.LI,
              text: 'Esto significa que necesitas 2-3 meses de renta disponibles al momento de firmar',
            },
            { type: ContentType.LI, text: 'Algunos solo piden el primer mes' },
          ],
        },
        { type: ContentType.H3, text: 'Comisión de agencia (si aplica)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Costo: 0.5 a 1 mes de renta' },
            { type: ContentType.LI, text: 'Cuándo se paga: Solo si usas una agencia inmobiliaria' },
            { type: ContentType.LI, text: 'Importante: Es un gasto único que no recuperarás' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Ejemplo de cálculo inicial: Si la renta es $1,000 mensuales:',
        },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Depósito de garantía: $2,000' },
            { type: ContentType.LI, text: 'Primer mes: $1,000' },
            { type: ContentType.LI, text: 'Último mes: $1,000' },
            { type: ContentType.LI, text: 'Comisión agencia: $1,000' },
          ],
        },
        { type: ContentType.P, text: 'Total inicial requerido: $5,000' },
      ],
      // Servicios Públicos
      [
        { type: ContentType.H2, text: 'Servicios públicos' },
        {
          type: ContentType.P,
          text: 'Estos gastos varían significativamente según la ubicación, tamaño de la vivienda y tus hábitos de consumo:',
        },
        { type: ContentType.H3, text: 'Siempre a cargo del inquilino:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Electricidad: $50-150/mes (depende del uso de aire acondicionado/calefacción)',
            },
            { type: ContentType.LI, text: 'Gas: $30-80/mes (calefacción, agua caliente, cocina)' },
            { type: ContentType.LI, text: 'Agua: $30-60/mes' },
            { type: ContentType.LI, text: 'Internet y TV por cable: $40-100/mes' },
          ],
        },
        { type: ContentType.H3, text: 'A veces incluidos, a veces no:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Recolección de basura: $10-30/mes' },
            { type: ContentType.LI, text: 'Calefacción central: $50-200/mes en invierno' },
          ],
        },
        { type: ContentType.P, text: 'Total promedio en servicios: $200-400/mes' },
        {
          type: ContentType.P,
          text: 'Consejo de ahorro: Pregunta al inquilino anterior cuánto pagaba mensualmente en servicios. Es la información más precisa que puedes obtener.',
        },
      ],
      // Gastos Comunes o Expensas
      [
        { type: ContentType.H2, text: 'Gastos comunes o expensas' },
        {
          type: ContentType.P,
          text: 'Si alquilas un apartamento en un edificio, generalmente pagarás gastos comunes:',
        },
        { type: ContentType.H3, text: 'Qué incluyen:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Mantenimiento de áreas comunes (pasillos, jardines, elevadores)',
            },
            { type: ContentType.LI, text: 'Seguridad o portería' },
            { type: ContentType.LI, text: 'Limpieza de áreas comunes' },
            {
              type: ContentType.LI,
              text: 'Mantenimiento de instalaciones (piscina, gimnasio, salas)',
            },
            { type: ContentType.LI, text: 'Seguro del edificio' },
            { type: ContentType.LI, text: 'Fondo de reserva para reparaciones mayores' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Costo típico: $50-300/mes dependiendo del edificio y amenidades',
        },
        {
          type: ContentType.P,
          text: 'Importante: Verifica si estos gastos están incluidos en la renta o son adicionales. Algunos propietarios los incluyen, otros no.',
        },
      ],
      // Seguros
      [
        { type: ContentType.H2, text: 'Seguros' },
        { type: ContentType.H3, text: 'Seguro de inquilino (altamente recomendado)' },
        { type: ContentType.P, text: 'Costo: $15-40/mes' },
        { type: ContentType.P, text: 'Qué cubre:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Tus pertenencias personales (muebles, electrónicos, ropa)',
            },
            { type: ContentType.LI, text: 'Responsabilidad civil si causas daños a terceros' },
            {
              type: ContentType.LI,
              text: 'Gastos de vivienda temporal si la propiedad se vuelve inhabitable',
            },
            { type: ContentType.LI, text: 'Robo y vandalismo' },
          ],
        },
        {
          type: ContentType.P,
          text: '¿Por qué es importante? El seguro del propietario solo cubre el edificio, no tus cosas. Si hay un incendio o robo, sin seguro perderías todo.',
        },
        { type: ContentType.H3, text: 'Seguro de vida o fianza (a veces requerido)' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Algunos propietarios lo exigen como garantía adicional',
            },
            { type: ContentType.LI, text: 'Costo: Variable según tu perfil' },
          ],
        },
      ],
      // Estacionamiento
      [
        { type: ContentType.H2, text: 'Estacionamiento' },
        { type: ContentType.P, text: 'No asumas que está incluido:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Estacionamiento descubierto: $50-100/mes adicionales' },
            {
              type: ContentType.LI,
              text: 'Estacionamiento cubierto/garaje: $100-200/mes adicionales',
            },
            {
              type: ContentType.LI,
              text: 'Estacionamiento de visitantes: Generalmente limitado y requiere permisos',
            },
          ],
        },
      ],
      // Mobiliario y Equipamiento
      [
        { type: ContentType.H2, text: 'Mobiliario y equipamiento' },
        { type: ContentType.H3, text: 'Si la propiedad no viene amueblada:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Mobiliario básico: $1,500-5,000 inicial' },
            {
              type: ContentType.LI,
              text: 'Electrodomésticos: $1,000-3,000 (si no están incluidos)',
            },
            { type: ContentType.LI, text: 'Utensilios y menaje: $300-800' },
          ],
        },
        { type: ContentType.H3, text: 'Incluso en propiedades amuebladas necesitarás:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Ropa de cama, toallas: $200-400' },
            { type: ContentType.LI, text: 'Artículos de limpieza: $50-100' },
            { type: ContentType.LI, text: 'Decoración básica: $200-500' },
          ],
        },
      ],
      // Otros servicios y costos
      [
        { type: ContentType.H2, text: 'Servicios adicionales' },
        { type: ContentType.H3, text: 'Limpieza (si aplica)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Limpieza profunda inicial: $100-300 una vez' },
            { type: ContentType.LI, text: 'Servicio regular: $50-100 cada visita' },
          ],
        },
        { type: ContentType.H3, text: 'Mantenimiento de Áreas Exteriores' },
        {
          type: ContentType.P,
          text: 'Si alquilas una casa con jardín: $50-200/mes para jardinería',
        },
        { type: ContentType.H3, text: 'Control de Plagas' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Servicio regular: $30-100 por tratamiento' },
            { type: ContentType.LI, text: 'Algunos edificios lo incluyen en gastos comunes' },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'El costo real de alquilar es significativamente mayor al precio de la renta mensual anunciada. Un alquiler de $1,000/mes realmente te costará aproximadamente $1,500-1,600/mes cuando consideras todos los gastos asociados.',
        },
        { type: ContentType.P, text: 'Puntos clave para recordar:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Necesitarás 6-8 veces la renta mensual para mudarte (costos iniciales)',
            },
            {
              type: ContentType.LI,
              text: 'Tu gasto mensual real será 40-60% mayor que la renta base',
            },
            { type: ContentType.LI, text: 'Mantén un fondo de emergencia de al menos 2 meses' },
            {
              type: ContentType.LI,
              text: 'Lee cuidadosamente qué está incluido y qué no en tu contrato',
            },
            { type: ContentType.LI, text: 'Pide recibos de servicios de inquilinos anteriores' },
            { type: ContentType.LI, text: 'Considera todos estos gastos antes de comprometerte' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Planificar adecuadamente tu presupuesto de alquiler evitará estrés financiero y te permitirá disfrutar de tu nuevo hogar sin preocupaciones constantes por dinero.',
        },
      ],
    ],
  },
  {
    id: 3,
    title: 'Red flags: Señales de alerta en alquileres',
    excerpt:
      'Identifica las banderas rojas que indican posibles estafas o problemas serios con un alquiler o inmobiliaria.',
    category: ArticleType.SECURITY,
    date: 'Nov 20, 2024',
    readTime: '7 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'El mercado de alquileres puede ser un campo minado de estafas, propietarios problemáticos y situaciones peligrosas. Cada año, miles de personas pierden dinero o terminan en situaciones de alquiler terribles porque ignoraron las señales de advertencia. Esta guía te ayudará a identificar las "red flags" más comunes para que puedas protegerte y tomar decisiones informadas.',
        },
      ],
      // Red Flags del Propietario o Agente
      [
        { type: ContentType.H2, text: '🚩 Red Flags del propietario o agente' },
        { type: ContentType.H3, text: '1. Presión excesiva para firmar rápidamente' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: '"Hay otras 10 personas interesadas, debes decidir ahora"',
            },
            { type: ContentType.LI, text: '"Esta oferta solo es válida hoy"' },
            { type: ContentType.LI, text: 'No te permiten leer el contrato con calma' },
            { type: ContentType.LI, text: 'Te apuran durante la visita a la propiedad' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Los estafadores y propietarios problemáticos usan tácticas de presión para evitar que investigues o pienses con claridad. Un propietario legítimo entiende que necesitas tiempo para tomar una decisión importante.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Tómate el tiempo necesario. Si alguien no respeta tu necesidad de analizar, es mejor buscar otra opción.',
        },
        { type: ContentType.H3, text: '2. Se niega a mostrarte la propiedad en persona' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Solo ofrece fotos o videos' },
            {
              type: ContentType.LI,
              text: 'Dice estar "fuera del país" pero puedes alquilar igualmente',
            },
            { type: ContentType.LI, text: 'Ofrece enviar las llaves por correo tras un depósito' },
            {
              type: ContentType.LI,
              text: 'Se niega a hacer videollamada para mostrar la propiedad',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Esta es una de las estafas más comunes. El "propietario" no existe, la propiedad no está disponible, o directamente no es suya.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: NUNCA alquiles sin ver la propiedad en persona o al menos por videollamada en tiempo real donde puedas dirigir la cámara.',
        },
        { type: ContentType.H3, text: '3. Solicita Pagos por Métodos No Rastreables' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Pide transferencias internacionales' },
            { type: ContentType.LI, text: 'Quiere pagos en efectivo sin recibo' },
            { type: ContentType.LI, text: 'Solicita criptomonedas' },
            { type: ContentType.LI, text: 'Pide gift cards o tarjetas prepagadas' },
            { type: ContentType.LI, text: 'Prefiere apps de pago entre personas (sin protección)' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Los métodos no rastreables son imposibles de recuperar si resulta ser una estafa.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Usa solo métodos verificables: transferencias bancarias oficiales, cheques, o plataformas de pago con protección al comprador. SIEMPRE pide recibos.',
        },
        { type: ContentType.H3, text: '4. Información inconsistente o evasiva' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Las respuestas cambian entre conversaciones' },
            { type: ContentType.LI, text: 'Evita responder preguntas específicas' },
            {
              type: ContentType.LI,
              text: 'La información del anuncio no coincide con lo que dice',
            },
            { type: ContentType.LI, text: 'No puede proporcionar documentación de propiedad' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: La falta de transparencia indica que oculta algo o directamente está mintiendo.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Exige claridad y documentación. Verifica la identidad del propietario y su derecho legal a alquilar.',
        },
        { type: ContentType.H3, text: '5. No Quiere Formalizar el Contrato' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Propone un acuerdo "informal" o "de palabra"' },
            { type: ContentType.LI, text: 'El contrato es extremadamente vago' },
            { type: ContentType.LI, text: 'Se niega a darte una copia del contrato' },
            {
              type: ContentType.LI,
              text: 'Quiere modificar términos verbalmente después de firmar',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Sin un contrato formal, no tienes protección legal. Pueden cambiarte las condiciones arbitrariamente.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Insiste en un contrato escrito, detallado y firmado por ambas partes. Consúltalo con un abogado si es necesario.',
        },
      ],
      // Red Flags de la Propiedad
      [
        { type: ContentType.H2, text: '🚩 Red Flags de la propiedad' },
        { type: ContentType.H3, text: '6. Precio sospechosamente bajo' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'El precio es 30-50% menor al mercado en esa zona' },
            { type: ContentType.LI, text: 'El anuncio dice "demasiado bueno para ser verdad"' },
            { type: ContentType.LI, text: 'Propiedad lujosa a precio de ganga' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: O es una estafa, o la propiedad tiene problemas graves no revelados.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Investiga precios de mercado en la zona. Si algo parece demasiado bueno, probablemente no lo sea.',
        },
        { type: ContentType.H3, text: '7. Estado de Abandono o Deterioro Severo' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Humedad visible en paredes y techos' },
            { type: ContentType.LI, text: 'Olor a moho persistente' },
            { type: ContentType.LI, text: 'Grietas estructurales importantes' },
            { type: ContentType.LI, text: 'Instalaciones eléctricas expuestas o peligrosas' },
            { type: ContentType.LI, text: 'Ventanas rotas o que no cierran' },
            { type: ContentType.LI, text: 'Presencia evidente de plagas' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Problemas de mantenimiento graves indican un propietario negligente que no arreglará nada una vez que te mudes.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Documenta todo con fotos. Si hay problemas serios, exige que se reparen ANTES de mudarte o busca otra opción.',
        },
        { type: ContentType.H3, text: '8. Problemas de Seguridad Evidentes' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Cerraduras rotas o endebles' },
            { type: ContentType.LI, text: 'Puertas o ventanas que no cierran bien' },
            { type: ContentType.LI, text: 'Falta de iluminación en áreas comunes' },
            { type: ContentType.LI, text: 'El barrio se siente inseguro' },
            {
              type: ContentType.LI,
              text: 'No hay rejas o sistemas de seguridad en zonas problemáticas',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Tu seguridad personal está en riesgo.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Visita el barrio a diferentes horas. Habla con vecinos sobre seguridad. No comprometas tu seguridad por un buen precio.',
        },
        { type: ContentType.H3, text: '9. El Propietario Actual o Vecinos Advierten' },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Vecinos mencionan problemas con el propietario' },
            { type: ContentType.LI, text: 'El inquilino actual se va por conflictos' },
            {
              type: ContentType.LI,
              text: 'Hay quejas sobre ruido constante o problemas del edificio',
            },
            {
              type: ContentType.LI,
              text: 'Te advierten sobre condiciones que el propietario no mencionó',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: La gente que ya vive ahí o vivió ahí tiene información valiosa de primera mano.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: SIEMPRE habla con vecinos. Sus experiencias son el mejor indicador de lo que te espera.',
        },
        {
          type: ContentType.H3,
          text: '10. Anuncios con Fotos Profesionales Perfectas vs. Realidad',
        },
        { type: ContentType.P, text: 'Señales de alerta:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Las fotos del anuncio no coinciden con la realidad' },
            { type: ContentType.LI, text: 'Ángulos engañosos que hacen ver espacios más grandes' },
            {
              type: ContentType.LI,
              text: 'Fotos de otras propiedades (búscalas en Google inverso)',
            },
            { type: ContentType.LI, text: 'Filtros excesivos que ocultan defectos' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Por qué es preocupante: Indica deshonestidad desde el principio.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Pide fotos actuales sin editar. Toma tus propias fotos durante la visita.',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Las red flags en alquileres no son solo precauciones exageradas: son señales reales de problemas que pueden costarte dinero, seguridad y paz mental. No ignores tu intuición cuando algo no se siente bien.',
        },
        { type: ContentType.P, text: 'Recuerda:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Es mejor perder una oportunidad que caer en una estafa',
            },
            { type: ContentType.LI, text: 'Las estafas de alquiler son extremadamente comunes' },
            {
              type: ContentType.LI,
              text: 'Los propietarios honestos entienden y respetan tu precaución',
            },
            {
              type: ContentType.LI,
              text: 'Nunca comprometas tu seguridad por urgencia o un buen precio',
            },
            {
              type: ContentType.LI,
              text: 'Si múltiples red flags están presentes, aléjate inmediatamente',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'La regla de oro: Si algo parece demasiado bueno para ser verdad, o algo se siente mal, probablemente hay un problema. Confía en tu instinto y no tengas miedo de caminar hacia otro lado.',
        },
        {
          type: ContentType.P,
          text: 'Tu hogar debe ser un lugar seguro y confiable. Tomar el tiempo para identificar y evitar red flags te ahorrará problemas serios en el futuro.',
        },
      ],
    ],
  },
  {
    id: 4,
    title: 'Derechos y deberes del inquilino: Guía completa',
    excerpt:
      'Todo lo que necesitas saber sobre tus derechos y responsabilidades legales como inquilino en España.',
    category: ArticleType.TIPS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Conocer tus derechos y deberes como inquilino es fundamental para protegerte de abusos, evitar conflictos legales y mantener una buena relación con tu propietario. Muchos inquilinos desconocen las protecciones legales que tienen, mientras que otros ignoran sus responsabilidades y terminan en problemas. Esta guía completa te ayudará a entender exactamente cuáles son tus derechos y obligaciones.',
        },
      ],
      // Tus Derechos como Inquilino
      [
        { type: ContentType.H2, text: 'Tus Derechos como Inquilino' },
        { type: ContentType.H3, text: '1. Derecho a un Contrato Escrito' },
        { type: ContentType.P, text: 'Lo que significa:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Tienes derecho a exigir un contrato de arrendamiento por escrito',
            },
            {
              type: ContentType.LI,
              text: 'El contrato debe incluir todos los términos y condiciones',
            },
            { type: ContentType.LI, text: 'Debes recibir una copia firmada por ambas partes' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Aunque los contratos verbales pueden ser válidos, son difíciles de probar. Un contrato escrito te protege documentando exactamente qué se acordó.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer si se viola: Puedes negarte a mudarte hasta tener un contrato escrito. Si ya te mudaste, exige el contrato inmediatamente.',
        },
      ],
      [
        { type: ContentType.H3, text: '2. Derecho a una Vivienda Habitable' },
        {
          type: ContentType.P,
          text: 'Lo que significa: La propiedad debe cumplir con estándares mínimos de habitabilidad:',
        },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Estructura segura (sin grietas peligrosas, techos estables)',
            },
            { type: ContentType.LI, text: 'Agua potable funcionando' },
            { type: ContentType.LI, text: 'Instalaciones eléctricas seguras' },
            { type: ContentType.LI, text: 'Calefacción adecuada (en climas fríos)' },
            {
              type: ContentType.LI,
              text: 'Protección contra elementos (ventanas, puertas que cierran)',
            },
            { type: ContentType.LI, text: 'Libre de plagas' },
            { type: ContentType.LI, text: 'Sistemas de saneamiento funcionando' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: El propietario está legalmente obligado a mantener la propiedad en condiciones habitables. No puede alquilar una vivienda que no cumple estándares de seguridad y salud.',
        },
        { type: ContentType.P, text: 'Qué hacer si se viola:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Notifica al propietario por escrito' },
            {
              type: ContentType.LI,
              text: 'Si no responde, puedes contactar autoridades de vivienda',
            },
            {
              type: ContentType.LI,
              text: 'En casos graves, puedes retener el alquiler o rescindir el contrato',
            },
            { type: ContentType.LI, text: 'Documenta todo con fotos y fechas' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: '3. Derecho a la Privacidad' },
        { type: ContentType.P, text: 'Lo que significa:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'El propietario NO puede entrar cuando quiera' },
            {
              type: ContentType.LI,
              text: 'Debe avisar con anticipación (generalmente 24-48 horas)',
            },
            {
              type: ContentType.LI,
              text: 'Solo puede entrar por razones legítimas: reparaciones urgentes, inspecciones razonables, mostrar la propiedad',
            },
            {
              type: ContentType.LI,
              text: 'No puede entrar sin tu consentimiento excepto en emergencias reales',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Tu hogar alquilado es tu espacio privado. Las entradas sin aviso o permiso son violaciones a tu derecho de privacidad y en algunos casos pueden ser consideradas allanamiento.',
        },
        { type: ContentType.P, text: 'Qué hacer si se viola:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Documenta cada entrada no autorizada' },
            {
              type: ContentType.LI,
              text: 'Envía carta formal solicitando que respete tu privacidad',
            },
            { type: ContentType.LI, text: 'Si continúa, puedes presentar denuncia legal' },
            {
              type: ContentType.LI,
              text: 'Considera cambiar cerraduras (verificando que sea legal en tu contrato)',
            },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: '4. Derecho a No Sufrir Discriminación' },
        {
          type: ContentType.P,
          text: 'Lo que significa: El propietario no puede discriminarte por:',
        },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Raza, color, origen nacional' },
            { type: ContentType.LI, text: 'Religión' },
            { type: ContentType.LI, text: 'Sexo, orientación sexual, identidad de género' },
            { type: ContentType.LI, text: 'Estado familiar (niños, embarazo)' },
            { type: ContentType.LI, text: 'Discapacidad' },
            { type: ContentType.LI, text: 'Edad (en muchas jurisdicciones)' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Las leyes de vivienda justa prohíben discriminación en alquiler. Esto incluye negarse a alquilarte, establecer términos diferentes, o acosarte por estas características.',
        },
        { type: ContentType.P, text: 'Qué hacer si se viola:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Documenta comentarios o acciones discriminatorias' },
            { type: ContentType.LI, text: 'Presenta queja ante agencias de vivienda justa' },
            { type: ContentType.LI, text: 'Consulta con abogado especializado en discriminación' },
            { type: ContentType.LI, text: 'En casos claros, puedes demandar por daños' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: '5. Derecho a la Devolución del Depósito de Garantía' },
        { type: ContentType.P, text: 'Lo que significa:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Tienes derecho a recuperar tu depósito al finalizar el contrato',
            },
            {
              type: ContentType.LI,
              text: 'Solo pueden descontarse daños más allá del desgaste normal',
            },
            {
              type: ContentType.LI,
              text: 'El propietario debe darte un detalle itemizado de cualquier descuento',
            },
            {
              type: ContentType.LI,
              text: 'Debe devolverte el depósito en un plazo específico (varía por jurisdicción, usualmente 15-30 días)',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: El depósito es TU dinero en custodia, no un pago al propietario. Retenerlo sin justificación es ilegal.',
        },
        { type: ContentType.P, text: 'Qué hacer si se viola:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Documenta el estado de la propiedad al entrar y salir con fotos fechadas',
            },
            { type: ContentType.LI, text: 'Exige lista detallada de descuentos por escrito' },
            { type: ContentType.LI, text: 'Si es injustificado, envía carta de demanda' },
            { type: ContentType.LI, text: 'Puedes demandar en tribunal de pequeñas causas' },
          ],
        },
      ],
      // Continúo con los derechos restantes...
      [
        { type: ContentType.H3, text: '6. Derecho a Renovación del Contrato' },
        { type: ContentType.P, text: 'Lo que significa:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'En muchas jurisdicciones, tienes derecho preferente de renovar',
            },
            {
              type: ContentType.LI,
              text: 'El propietario no puede negarse arbitrariamente (en algunos lugares)',
            },
            { type: ContentType.LI, text: 'Los aumentos de renta están regulados en muchas áreas' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Dependiendo de las leyes locales, especialmente en áreas con control de rentas, puedes tener derecho a renovar tu contrato bajo ciertas condiciones.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer si se viola: Revisa las leyes locales sobre renovación. Notifica tu intención de renovar por escrito dentro del plazo requerido. Si se niega sin causa legal, busca asesoría legal.',
        },
      ],
      [
        { type: ContentType.H3, text: '7. Derecho a Hacer Reparaciones de Emergencia' },
        {
          type: ContentType.P,
          text: 'Lo que significa: Si hay una emergencia y el propietario no responde, puedes hacer la reparación y deducir el costo de la renta (con reglas específicas). Debes notificar al propietario primero y dar tiempo razonable.',
        },
        {
          type: ContentType.P,
          text: 'Protección legal: No puedes quedarte sin agua, calefacción o en situación peligrosa esperando que el propietario actúe.',
        },
        { type: ContentType.P, text: 'Qué hacer:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: 'Notifica al propietario inmediatamente (por escrito, guarda prueba)',
            },
            {
              type: ContentType.LI,
              text: 'Da tiempo razonable para responder (24 horas en emergencias)',
            },
            { type: ContentType.LI, text: 'Si no responde, haz la reparación mínima necesaria' },
            { type: ContentType.LI, text: 'Guarda todos los recibos' },
            { type: ContentType.LI, text: 'Notifica que deducirás de la renta con documentación' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: '8. Derecho a Organizarte con Otros Inquilinos' },
        {
          type: ContentType.P,
          text: 'Lo que significa: Puedes formar asociaciones de inquilinos, discutir condiciones de alquiler con otros inquilinos, y no pueden desalojarte por organizarte.',
        },
        {
          type: ContentType.P,
          text: 'Protección legal: En muchas jurisdicciones, organizarse colectivamente está protegido.',
        },
      ],
      [
        { type: ContentType.H3, text: '9. Derecho a Protección contra Desalojo Ilegal' },
        { type: ContentType.P, text: 'Lo que significa:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'El propietario NO puede simplemente echarte' },
            { type: ContentType.LI, text: 'Debe seguir un proceso legal formal' },
            {
              type: ContentType.LI,
              text: 'No puede cambiar cerraduras, cortar servicios o amenazarte para que te vayas',
            },
            {
              type: ContentType.LI,
              text: 'Tienes derecho a notificación adecuada y oportunidad de remediar',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Los desalojos "auto-ayuda" son ilegales. Solo un tribunal puede ordenar tu desalojo.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer si amenaza con desalojo ilegal: Documenta todas las amenazas, no te vayas voluntariamente si es injusto, busca ayuda legal inmediatamente. Si cambia cerraduras o corta servicios, llama a la policía y presenta denuncia.',
        },
      ],
      [
        { type: ContentType.H3, text: '10. Derecho a Modificaciones por Discapacidad' },
        {
          type: ContentType.P,
          text: 'Lo que significa: Puedes solicitar modificaciones razonables para discapacidad. El propietario debe permitir instalación de rampas, barras de apoyo, etc. Puedes tener que pagar las modificaciones y restaurar al salir.',
        },
        {
          type: ContentType.P,
          text: 'Protección legal: Las leyes de accesibilidad protegen tu derecho a adaptar la vivienda a tus necesidades.',
        },
      ],
      // Tus Deberes como Inquilino
      [
        { type: ContentType.H2, text: 'Tus Deberes como Inquilino' },
        { type: ContentType.H3, text: '1. Pagar la Renta a Tiempo' },
        {
          type: ContentType.P,
          text: 'Lo que significa: Debes pagar el monto completo en la fecha acordada. El retraso puede resultar en cargos por mora. El incumplimiento persistente es causa de desalojo.',
        },
        {
          type: ContentType.P,
          text: 'Responsabilidad legal: Pagar la renta es tu obligación principal. No cumplir te pone en riesgo de desalojo legal.',
        },
        {
          type: ContentType.P,
          text: 'Consecuencias de no cumplir: Cargos por pago tardío, daño a tu historial de alquiler, proceso de desalojo, demanda por renta no pagada.',
        },
        {
          type: ContentType.P,
          text: 'Si tienes problemas para pagar: Comunica al propietario ANTES de la fecha de pago, negocia un plan de pago, busca asistencia de programas de ayuda, no ignores el problema.',
        },
      ],
      [
        { type: ContentType.H3, text: '2. Mantener la Propiedad Limpia y en Buen Estado' },
        {
          type: ContentType.P,
          text: 'Responsabilidad legal: Debes cuidar la propiedad como lo haría una persona razonable. El desgaste normal es aceptable, pero negligencia o daño intencional no.',
        },
        { type: ContentType.P, text: 'Ejemplos de lo que SÍ es tu responsabilidad:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Cambiar bombillas' },
            { type: ContentType.LI, text: 'Limpiar derrames antes de que causen daño' },
            { type: ContentType.LI, text: 'No dejar que se acumule basura' },
            { type: ContentType.LI, text: 'Reportar goteras antes de que empeoren' },
            { type: ContentType.LI, text: 'Usar ventilación para prevenir moho por condensación' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Ejemplos de lo que NO es tu responsabilidad: Reparaciones estructurales, reemplazar electrodomésticos por vejez, reparar plomería o sistemas eléctricos, arreglar techo con goteras.',
        },
      ],
      [
        { type: ContentType.H3, text: '3. No Realizar Cambios Sin Permiso' },
        {
          type: ContentType.P,
          text: 'Responsabilidad legal: La propiedad no es tuya. Alterarla sin permiso viola el contrato.',
        },
        {
          type: ContentType.P,
          text: 'Qué necesita permiso generalmente: Pintar paredes, instalar estantes o soportes, cambiar cerraduras, instalar electrodomésticos, cualquier modificación permanente.',
        },
        {
          type: ContentType.P,
          text: 'Qué usualmente está permitido: Decoración removible (cuadros con clavos pequeños), muebles y decoración temporal, cambiar cortinas, usar adhesivos removibles.',
        },
      ],
      [
        { type: ContentType.H3, text: '4. Seguir las Reglas del Edificio o Comunidad' },
        {
          type: ContentType.P,
          text: 'Debes respetar el reglamento interno: horarios de silencio, uso de áreas comunes, normas de convivencia, políticas sobre mascotas, estacionamiento, etc.',
        },
        {
          type: ContentType.P,
          text: 'Consecuencias de no cumplir: Advertencias escritas, multas, restricción de acceso a amenidades, proceso de desalojo en casos graves.',
        },
      ],
      [
        { type: ContentType.H3, text: '5. No Realizar Actividades Ilegales' },
        {
          type: ContentType.P,
          text: 'No puedes usar la propiedad para actividades criminales: drogas, actividades ilegales de negocio, almacenar bienes robados, etc.',
        },
        {
          type: ContentType.P,
          text: 'Consecuencias: Desalojo inmediato sin oportunidad de remediar, pérdida del depósito, cargos criminales, daño permanente a tu historial.',
        },
      ],
      [
        { type: ContentType.H3, text: '6. Permitir Acceso para Reparaciones e Inspecciones' },
        {
          type: ContentType.P,
          text: 'Debes permitir entrada para reparaciones necesarias y facilitar inspecciones razonables. El propietario debe dar aviso apropiado (excepto emergencias).',
        },
        {
          type: ContentType.P,
          text: 'Equilibrio entre derechos: El propietario debe avisar (24-48 horas usualmente), tú debes permitir acceso en horarios razonables. Puedes rechazar en caso de aviso inadecuado, pero no puedes negar acceso indefinidamente.',
        },
      ],
      [
        { type: ContentType.H3, text: '7. Dar Aviso Apropiado al Terminar el Contrato' },
        {
          type: ContentType.P,
          text: 'Debes notificar con anticipación si no renovarás (usualmente 30-60 días). Avisar tarde puede costarte dinero adicional. El aviso debe ser por escrito.',
        },
        {
          type: ContentType.P,
          text: 'No dar aviso apropiado puede resultar en: Cobro de renta adicional por el período de aviso, pérdida de parte del depósito, complicaciones legales.',
        },
      ],
      [
        { type: ContentType.H3, text: '8. Devolver la Propiedad en Condición Razonable' },
        {
          type: ContentType.P,
          text: 'Debes limpiar la propiedad al salir, reparar cualquier daño más allá del desgaste normal, remover todas tus pertenencias y devolver todas las llaves.',
        },
        {
          type: ContentType.P,
          text: 'Desgaste normal (NO pagas): Decoloración menor de alfombras por uso, pequeñas marcas en paredes, cerraduras desgastadas por uso normal, pintura descolorida por tiempo.',
        },
        {
          type: ContentType.P,
          text: 'Daños (SÍ pagas): Agujeros grandes en paredes, manchas de quemaduras, mascotas que dañaron alfombras, electrodomésticos rotos por mal uso.',
        },
      ],
      [
        { type: ContentType.H3, text: '9. Mantener un Seguro Apropiado' },
        {
          type: ContentType.P,
          text: 'Es tu responsabilidad asegurar tus pertenencias. El seguro del propietario NO cubre tus cosas. En algunos lugares es requisito legal tener seguro de inquilino.',
        },
        {
          type: ContentType.P,
          text: 'Por qué es importante: Protege tus pertenencias (robo, incendio, agua), cubre responsabilidad si causas daño accidental a otros, es económico (generalmente $15-40/mes).',
        },
      ],
      [
        { type: ContentType.H3, text: '10. Comunicar Problemas Oportunamente' },
        {
          type: ContentType.P,
          text: 'Debes reportar problemas de mantenimiento pronto. No puedes esperar que empeoren y luego culpar al propietario. La comunicación debe ser por escrito cuando sea importante.',
        },
        {
          type: ContentType.P,
          text: 'Responsabilidad legal: Si no reportas un problema y empeora, puedes ser responsable del daño agravado. Ejemplo: Goteo pequeño no reportado se convierte en daño por agua severo - puedes ser responsable del daño adicional que se pudo prevenir.',
        },
      ],
      // Situaciones Especiales
      [
        { type: ContentType.H2, text: 'Situaciones Especiales' },
        { type: ContentType.H3, text: 'Subarrendamiento' },
        {
          type: ContentType.P,
          text: 'Tus derechos: Depende de tu contrato y leyes locales. Algunos lugares permiten subarrendar con permiso.',
        },
        {
          type: ContentType.P,
          text: 'Tus deberes: Debes obtener permiso por escrito del propietario, sigues siendo responsable del contrato principal, debes verificar inquilinos sub-arrendatarios.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Mascotas' },
        {
          type: ContentType.P,
          text: 'Tus derechos: Animales de servicio generalmente están permitidos por ley. Animales de apoyo emocional tienen protecciones en muchos lugares.',
        },
        {
          type: ContentType.P,
          text: 'Tus deberes: Respetar políticas de mascotas del contrato, pagar depósitos o renta adicional por mascotas, controlar tu mascota y prevenir daños, limpiar después de tu mascota.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Compañeros de Cuarto' },
        {
          type: ContentType.P,
          text: 'Tus derechos: Depende de si están en el contrato. Si el contrato lo permite, puedes tener roommates.',
        },
        {
          type: ContentType.P,
          text: 'Tus deberes: Todos en el contrato son responsables solidarios, eres responsable por comportamiento de tus huéspedes, debes cumplir límites de ocupación.',
        },
      ],
      // Cómo Proteger tus Derechos
      [
        { type: ContentType.H2, text: 'Cómo Proteger tus Derechos' },
        { type: ContentType.H3, text: 'Documentación Esencial' },
        { type: ContentType.P, text: 'Al mudarte:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Inspección completa con fotos/video fechados' },
            { type: ContentType.LI, text: 'Lista de inventario si viene amueblado' },
            { type: ContentType.LI, text: 'Lecturas de medidores' },
            { type: ContentType.LI, text: 'Estado de cada habitación documentado' },
          ],
        },
        { type: ContentType.P, text: 'Durante el alquiler:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Copia de todos los pagos de renta' },
            { type: ContentType.LI, text: 'Recibos de servicios si tú pagas' },
            { type: ContentType.LI, text: 'Correspondencia con el propietario' },
            { type: ContentType.LI, text: 'Reportes de problemas con fechas' },
            { type: ContentType.LI, text: 'Fotos de cualquier daño o problema' },
          ],
        },
        { type: ContentType.P, text: 'Al salir:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Inspección final con fotos/video' },
            { type: ContentType.LI, text: 'Confirmación de entrega de llaves' },
            { type: ContentType.LI, text: 'Dirección de reenvío para devolución de depósito' },
            { type: ContentType.LI, text: 'Lecturas finales de medidores' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: 'Comunicación Efectiva' },
        {
          type: ContentType.P,
          text: 'Siempre por escrito para asuntos importantes: Email (mantén copias), cartas certificadas (para asuntos serios), apps de mensajería (captura pantalla), portal del propietario (exporta registros).',
        },
        {
          type: ContentType.P,
          text: 'Qué documentar: Fecha y hora, quién dijo qué, testigos si es relevante, fotos/evidencia cuando aplique.',
        },
      ],
      // Cuándo Buscar Ayuda Legal
      [
        { type: ContentType.H2, text: 'Cuándo Buscar Ayuda Legal' },
        { type: ContentType.P, text: 'Situaciones que requieren abogado:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Amenazas de desalojo' },
            { type: ContentType.LI, text: 'Discriminación' },
            { type: ContentType.LI, text: 'Condiciones peligrosas no resueltas' },
            { type: ContentType.LI, text: 'Retención injustificada de depósito significativo' },
            { type: ContentType.LI, text: 'Violaciones serias de privacidad' },
            { type: ContentType.LI, text: 'Acoso o represalias' },
            { type: ContentType.LI, text: 'Contratos confusos o sospechosos' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Recursos disponibles: Clínicas legales gratuitas, organizaciones de derechos de inquilinos, asociaciones de vivienda justa, abogados de bajo costo, mediación como alternativa.',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Entender tus derechos y deberes como inquilino es fundamental para una experiencia de alquiler positiva y legalmente protegida. Recuerda:',
        },
        {
          type: ContentType.P,
          text: 'Sobre tus derechos: No tengas miedo de ejercerlos, documenta todo, busca ayuda cuando sea necesario, conoce las leyes locales específicas.',
        },
        {
          type: ContentType.P,
          text: 'Sobre tus deberes: Cumplirlos te protege legalmente, un buen historial de inquilino facilita futuros alquileres, la comunicación y el respeto previenen la mayoría de conflictos.',
        },
        {
          type: ContentType.P,
          text: 'La clave está en el equilibrio: conoce y ejerce tus derechos, pero cumple con tus responsabilidades. Un inquilino informado es un inquilino empoderado.',
        },
        {
          type: ContentType.P,
          text: 'Recursos adicionales: Consulta las leyes de arrendamiento específicas de tu ciudad o país, ya que pueden variar significativamente de esta guía general.',
        },
      ],
    ],
  },
  {
    id: 5,
    title: 'Cómo negociar el mejor precio de alquiler',
    excerpt:
      'Estrategias efectivas para negociar y obtener las mejores condiciones en tu contrato de alquiler.',
    category: ArticleType.TIPS,
    date: 'Nov 15, 2024',
    readTime: '5 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Muchos inquilinos pagan más de lo necesario porque nunca intentan negociar. La realidad es que la mayoría de propietarios y agentes inmobiliarios esperan cierto nivel de negociación. El precio inicial es a menudo solo un punto de partida. Con las estrategias correctas y un poco de confianza, puedes ahorrar cientos o incluso miles de dólares anuales en tu alquiler.',
        },
      ],
      // Preparación: Antes de Negociar
      [
        { type: ContentType.H2, text: 'Preparación: Antes de Negociar' },
        { type: ContentType.H3, text: '1. Investiga el Mercado' },
        { type: ContentType.P, text: 'Lo que debes saber:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Precio promedio de alquileres similares en el barrio' },
            { type: ContentType.LI, text: 'Cuánto tiempo llevan las propiedades en el mercado' },
            { type: ContentType.LI, text: 'Si el mercado favorece a inquilinos o propietarios' },
            {
              type: ContentType.LI,
              text: 'Tendencias estacionales (generalmente más negociable en invierno)',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Herramientas de investigación: Portales inmobiliarios online, hablar con agentes inmobiliarios, preguntar a vecinos cuánto pagan, grupos de Facebook del barrio, reportes de mercado inmobiliario local.',
        },
        {
          type: ContentType.P,
          text: 'Tip profesional: Si puedes demostrar con datos que propiedades similares se alquilan por menos, tienes una base sólida para negociar.',
        },
      ],
      [
        { type: ContentType.H3, text: '2. Evalúa tu Posición' },
        { type: ContentType.P, text: 'Eres un candidato más fuerte si:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Tienes excelente historial crediticio' },
            { type: ContentType.LI, text: 'Referencias impecables de propietarios anteriores' },
            { type: ContentType.LI, text: 'Empleo estable con ingresos verificables' },
            { type: ContentType.LI, text: 'Puedes pagar varios meses adelantados' },
            {
              type: ContentType.LI,
              text: 'No tienes mascotas (si el propietario las ve como problema)',
            },
            { type: ContentType.LI, text: 'Buscas contrato a largo plazo' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Tu poder de negociación aumenta cuando: La propiedad lleva mucho tiempo sin alquilarse, es temporada baja (otoño/invierno), hay muchas propiedades disponibles en la zona, el propietario necesita alquilar rápido, la propiedad tiene defectos que notaste.',
        },
      ],
      [
        { type: ContentType.H3, text: '3. Define tu Estrategia' },
        { type: ContentType.P, text: 'Decide de antemano:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '¿Cuánto estás dispuesto a pagar máximo?' },
            { type: ContentType.LI, text: '¿Qué tan bajo puedes empezar la negociación?' },
            { type: ContentType.LI, text: '¿Qué concesiones alternativas aceptarías?' },
            { type: ContentType.LI, text: '¿Estás dispuesto a irte si no negocia?' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Importante: Nunca muestres desesperación. Siempre debes estar preparado para caminar hacia otra opción.',
        },
      ],
      // Estrategias de Negociación Efectivas
      [
        { type: ContentType.H2, text: 'Estrategias de Negociación Efectivas' },
        { type: ContentType.H3, text: 'Estrategia 1: Encuentra y Menciona Defectos' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Durante la visita, documenta todo lo que necesita mejora o reparación. Usa estos puntos como palanca de negociación.',
        },
        {
          type: ContentType.P,
          text: 'Ejemplos de defectos negociables: Paredes que necesitan pintura, electrodomésticos viejos o que no funcionan bien, grietas menores o humedad, jardín descuidado, alfombras manchadas o desgastadas, falta de amenidades que otras propiedades sí tienen.',
        },
        {
          type: ContentType.P,
          text: 'Script de negociación: "Me interesa mucho la propiedad, pero noté que las paredes necesitan pintura, la estufa es muy vieja y el jardín requiere trabajo. Considerando que tendría que vivir con estas condiciones o invertir en mejoras, ¿estaría dispuesto a reducir el precio a $X?"',
        },
        {
          type: ContentType.P,
          text: 'Variante: Ofrece hacer tú las mejoras a cambio de reducción de renta: "Si yo me encargo de pintar y arreglar el jardín, ¿podemos reducir la renta?"',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 2: Compromiso de Largo Plazo' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Los propietarios valoran la estabilidad. Ofrecer un contrato más largo puede conseguirte un mejor precio.',
        },
        {
          type: ContentType.P,
          text: 'Propuesta específica: "Veo que está pidiendo $1,200 mensuales. Si firmo un contrato de 2 años en lugar de 1, ¿podría reducirlo a $1,150? Para usted significa sin preocupaciones por dos años, y para mí un ahorro significativo."',
        },
        {
          type: ContentType.P,
          text: 'Ventajas para el propietario: Sin períodos de vacante, sin costos de búsqueda de nuevo inquilino, sin gastos de agencia, ingreso garantizado estable.',
        },
        {
          type: ContentType.P,
          text: 'Ventaja para ti: Precio bloqueado por más tiempo, no te afectan aumentos anuales, mayor estabilidad.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 3: Ofrecer Pago Adelantado' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Si tienes el capital, ofrecer varios meses adelantados es muy atractivo para propietarios.',
        },
        { type: ContentType.P, text: 'Propuestas efectivas:' },
        {
          type: ContentType.P,
          text: 'Opción A - Descuento por adelanto: "Si pago 6 meses adelantados en efectivo, ¿puede darme un descuento del 5% en el precio total?"',
        },
        {
          type: ContentType.P,
          text: 'Opción B - Mejor precio mensual: "Si le pago 3 meses adelantados cada vez, ¿puede bajar la renta mensual de $1,200 a $1,150?"',
        },
        {
          type: ContentType.P,
          text: 'Opción C - Eliminar depósito: "Como le pagaré 4 meses adelantados, ¿podríamos eliminar o reducir el depósito de garantía?"',
        },
        {
          type: ContentType.P,
          text: 'Advertencia: Solo usa esta estrategia si confías completamente en el propietario, has verificado que es el dueño legítimo, tienes todo por escrito y no compromete tus ahorros de emergencia.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 4: Comparación Directa' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Muestra anuncios de propiedades comparables más baratas.',
        },
        {
          type: ContentType.P,
          text: 'Preparación: Imprime o guarda screenshots de 3-5 propiedades similares más baratas, asegúrate que sean comparables (tamaño, ubicación, condición), calcula el precio promedio.',
        },
        {
          type: ContentType.P,
          text: 'Script: "He estado investigando el mercado y encontré propiedades muy similares en este barrio por $1,000-1,100. Su propiedad está en $1,300. Entiendo que tiene [menciona ventajas], pero ¿podríamos ajustar el precio a algo más cercano al mercado, digamos $1,150?"',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Muestra que has hecho tu tarea y sabes el valor real. Los propietarios inteligentes prefieren ajustar que perder un buen inquilino.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 5: Negociación Silenciosa' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Después de ver la propiedad, simplemente di que te interesa pero el precio está fuera de tu presupuesto. A veces el propietario o agente preguntará cuál es tu presupuesto.',
        },
        {
          type: ContentType.P,
          text: 'Ejemplo: "Me encanta la propiedad y cumple todo lo que busco. Desafortunadamente está un poco fuera de mi presupuesto. Mi rango es hasta $1,100." Luego SILENCIO. Deja que ellos hablen.',
        },
        {
          type: ContentType.P,
          text: 'Posibles respuestas: "Déjame hablar con el propietario", "¿Qué tal si nos encontramos en $1,150?", "Si pagas 6 meses adelantados podemos hacerlo".',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Pone la presión en ellos sin confrontación directa. Muchos agentes tienen margen para negociar que revelarán si creen que los perderán.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 6: Solicita Mejoras en Lugar de Descuento' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Si no bajan el precio, pide mejoras o inclusiones extras.',
        },
        {
          type: ContentType.P,
          text: 'Mejoras físicas: Pintar antes de que te mudes, instalar aire acondicionado o mejorar el existente, actualizar electrodomésticos, instalar lavadora/secadora, mejorar la seguridad (cerraduras, cámaras), renovar cocina o baño.',
        },
        {
          type: ContentType.P,
          text: 'Inclusiones extras: Incluir servicios (internet, cable, agua), agregar estacionamiento sin costo, amoblar parcial o completamente, incluir gastos comunes, servicio de limpieza periódico.',
        },
        {
          type: ContentType.P,
          text: 'Script: "Entiendo que $1,300 es su precio. Si no puede bajarlo, ¿estaría dispuesto a incluir el internet y el estacionamiento en ese precio? Eso me ayudaría mucho con mi presupuesto."',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 7: Flexibilidad en Fechas de Mudanza' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Ofrece mudarte en una fecha que le convenga al propietario a cambio de mejor precio.',
        },
        {
          type: ContentType.P,
          text: 'Propuesta: "Veo que la propiedad está disponible desde hace 2 meses. Si puedo ayudarlo a llenar ese espacio rápidamente mudándome esta semana, ¿podríamos ajustar el precio?"',
        },
        {
          type: ContentType.P,
          text: 'O al contrario: "Si necesita tiempo para hacer reparaciones y me puedo mudar dentro de 2 meses en lugar de inmediatamente, ¿podemos negociar el precio?"',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Le resuelves un problema y creas valor adicional más allá del precio.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 8: Trae un Co-Firmante o Garantía' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Si tienes historial crediticio débil, ofrecer un co-firmante fuerte puede mejorar tu posición negociadora.',
        },
        {
          type: ContentType.P,
          text: 'Propuesta: "Entiendo que mi historial crediticio puede ser una preocupación. Mi [padre/familiar] con excelente crédito puede co-firmar. Con esa garantía adicional, ¿podemos hablar de reducir el precio?"',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Reduces el riesgo percibido, lo que puede traducirse en mejor precio.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 9: Agrupa con Otros Inquilinos' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Si tienes roommates, presenta al grupo como un solo paquete confiable.',
        },
        {
          type: ContentType.P,
          text: 'Propuesta: "Somos tres profesionales con empleos estables. Juntos tenemos ingresos de $X. Al ser tres, el riesgo de impago es mínimo. ¿Puede considerar un mejor precio dado el perfil de bajo riesgo?"',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 10: Momento Oportuno' },
        { type: ContentType.P, text: 'Cuándo negociar es más efectivo:' },
        {
          type: ContentType.P,
          text: 'Mejor momento: Final de mes (propietario ansioso por llenar vacante), invierno/otoño (menos demanda), propiedad lleva 2+ meses sin alquilar, mercado con muchas propiedades disponibles, después de ver la propiedad 2-3 veces (muestra interés serio).',
        },
        {
          type: ContentType.P,
          text: 'Peor momento: Inicio de año universitario o temporada alta de mudanzas, recién publicado el anuncio, hay múltiples interesados, mercado muy competitivo.',
        },
      ],
      // Tácticas Avanzadas
      [
        { type: ContentType.H2, text: 'Tácticas Avanzadas' },
        { type: ContentType.H3, text: 'La Oferta Escrita Formal' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: En lugar de negociar verbalmente, presenta una oferta escrita formal.',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Muestra seriedad y profesionalismo, es más difícil rechazar algo por escrito, crea sensación de urgencia, te diferencia de otros candidatos.',
        },
      ],
      [
        { type: ContentType.H3, text: 'La Estrategia del "Ancla Baja"' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Empieza con una oferta significativamente más baja para "anclar" la negociación. Si piden $1,300, ofrece $1,050.',
        },
        {
          type: ContentType.P,
          text: 'Psicología: Cuando empiezas bajo, cualquier punto medio parece razonable. Si llegas a $1,150, ambos sienten que "ganaron" algo.',
        },
        { type: ContentType.P, text: 'Advertencia: No exageres o perderás credibilidad.' },
      ],
      [
        { type: ContentType.H3, text: 'La Opción de "Escalera"' },
        {
          type: ContentType.P,
          text: 'Cómo funciona: Ofrece incrementos graduales con compromisos incrementales.',
        },
        {
          type: ContentType.P,
          text: 'Propuesta: "¿Qué le parece esto? Año 1: $1,100/mes, Año 2: $1,150/mes, Año 3: $1,200/mes. Usted asegura un inquilino de largo plazo con incrementos predecibles, y yo planifico mi presupuesto con certeza."',
        },
      ],
      // Errores Comunes a Evitar
      [
        { type: ContentType.H2, text: 'Errores Comunes a Evitar' },
        {
          type: ContentType.P,
          text: 'Error 1: Mostrar Desesperación - Nunca digas: "Esta es mi única opción" o "Necesito mudarme urgentemente"',
        },
        {
          type: ContentType.P,
          text: 'Error 2: Ser Demasiado Agresivo - Evita ofertas insultantemente bajas o actitud conflictiva',
        },
        {
          type: ContentType.P,
          text: 'Error 3: Negociar Sin Información - No negocies sin conocer precios de mercado',
        },
        {
          type: ContentType.P,
          text: 'Error 4: Aceptar la Primera Contraoferta - Casi siempre hay margen para negociar más',
        },
        {
          type: ContentType.P,
          text: 'Error 5: Olvidar Pedir Todo por Escrito - Acuerdos verbales no valen nada',
        },
        {
          type: ContentType.P,
          text: 'Error 6: Negociar Después de Firmar - Todo debe negociarse ANTES de firmar',
        },
      ],
      // Qué Decir y Qué No Decir
      [
        { type: ContentType.H2, text: 'Qué Decir y Qué No Decir' },
        { type: ContentType.H3, text: 'Frases Que Funcionan' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '"Me encanta la propiedad, pero mi presupuesto es..."' },
            { type: ContentType.LI, text: '"¿Hay flexibilidad en el precio?"' },
            { type: ContentType.LI, text: '"¿Qué incluye exactamente ese precio?"' },
            { type: ContentType.LI, text: '"He visto propiedades similares por menos..."' },
            { type: ContentType.LI, text: '"Si me comprometo a [X], ¿podemos hablar del precio?"' },
            { type: ContentType.LI, text: '"¿Cuál sería su mejor oferta?"' },
          ],
        },
        { type: ContentType.H3, text: 'Frases Que Debes Evitar' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '"Pagaré lo que sea"' },
            { type: ContentType.LI, text: '"No tengo otras opciones"' },
            { type: ContentType.LI, text: '"No me importa el precio"' },
            { type: ContentType.LI, text: '"Puedo pagar más si..."' },
            { type: ContentType.LI, text: '"Esta es mi propiedad soñada"' },
          ],
        },
      ],
      // Negociación en Renovación
      [
        { type: ContentType.H2, text: 'Negociación en Renovación' },
        { type: ContentType.P, text: 'No olvides que también puedes negociar al renovar.' },
        {
          type: ContentType.P,
          text: 'Tu valor como inquilino actual: Has pagado siempre a tiempo, has cuidado la propiedad, no has causado problemas, el propietario evita costos de buscar nuevo inquilino.',
        },
        {
          type: ContentType.P,
          text: 'Script de renovación: "He sido un inquilino responsable durante [período]. Para evitarle el trabajo y costo de buscar nuevo inquilino, ¿podríamos mantener la renta actual en lugar del aumento propuesto? O al menos reducir el incremento?"',
        },
        {
          type: ContentType.P,
          text: 'Datos útiles: Buscar un nuevo inquilino cuesta al propietario 1-2 meses de renta, incluyendo tiempo vacante, publicidad, inspecciones, limpieza y posibles reparaciones.',
        },
      ],
      // Calculadora de Ahorro
      [
        { type: ContentType.H2, text: 'Calculadora de Ahorro' },
        { type: ContentType.P, text: 'Si negocias $150 menos por mes:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Ahorro mensual: $150' },
            { type: ContentType.LI, text: 'Ahorro anual: $1,800' },
            { type: ContentType.LI, text: 'Ahorro en 2 años: $3,600' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Ese dinero puede usarse para: Fondo de emergencia, ahorro para enganche de casa propia, pagar deudas, mejor calidad de vida.',
        },
      ],
      // Cuándo Aceptar y Cuándo Retirarse
      [
        { type: ContentType.H2, text: 'Cuándo Aceptar y Cuándo Retirarse' },
        { type: ContentType.P, text: 'Acepta si:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'El precio es justo para el mercado' },
            { type: ContentType.LI, text: 'Has conseguido algunas concesiones' },
            { type: ContentType.LI, text: 'La propiedad cumple tus necesidades' },
            { type: ContentType.LI, text: 'El propietario parece razonable y profesional' },
            { type: ContentType.LI, text: 'Los términos están claros por escrito' },
          ],
        },
        { type: ContentType.P, text: 'Retírate si:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'El propietario es inflexible y el precio es excesivo' },
            { type: ContentType.LI, text: 'Se niega a negociar nada' },
            { type: ContentType.LI, text: 'Muestra señales de alerta (red flags)' },
            { type: ContentType.LI, text: 'Hay problemas serios sin resolver' },
            { type: ContentType.LI, text: 'Puedes encontrar mejor valor en otro lugar' },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Negociar el alquiler no es solo aceptable, es esperado. La mayoría de propietarios y agentes tienen margen para negociar y respetan a inquilinos que lo hacen profesionalmente.',
        },
        { type: ContentType.P, text: 'Puntos clave para recordar:' },
        {
          type: ContentType.OL,
          children: [
            { type: ContentType.LI, text: 'Investiga antes: Conoce el mercado y tu posición' },
            { type: ContentType.LI, text: 'Sé profesional: Negociación ≠ confrontación' },
            { type: ContentType.LI, text: 'Documenta todo: Acuerdos por escrito siempre' },
            {
              type: ContentType.LI,
              text: 'Sé flexible: A veces mejores términos > precio más bajo',
            },
            {
              type: ContentType.LI,
              text: 'Está dispuesto a caminar: Tu mejor poder de negociación',
            },
            {
              type: ContentType.LI,
              text: 'Timing importa: Momentos oportunos dan mejores resultados',
            },
            {
              type: ContentType.LI,
              text: 'Muestra valor: Demuestra por qué eres un gran inquilino',
            },
            {
              type: ContentType.LI,
              text: 'Pide más de lo esperado: Siempre hay margen para negociar',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'El peor que puede pasar es que digan no. Pero no preguntar te garantiza pagar más de lo necesario.',
        },
        {
          type: ContentType.P,
          text: 'Recuerda: El dinero que ahorras negociando hoy se multiplica durante todo el período de alquiler. Vale la pena el esfuerzo de negociar inteligentemente.',
        },
      ],
    ],
  },
  {
    id: 6,
    title: 'Visita virtual: qué revisar cuando ves una propiedad',
    excerpt:
      'Lista completa de aspectos técnicos y prácticos que debes inspeccionar cuidadosamente en una visita.',
    category: ArticleType.GUIDES,
    date: 'Nov 12, 2024',
    readTime: '6 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'La visita a una propiedad es tu oportunidad de oro para detectar problemas antes de comprometerte. Muchos inquilinos se dejan llevar por la emoción de encontrar un lugar que les gusta y pasan por alto señales de alerta que les costarán caro más adelante. Esta guía te ayudará a realizar una inspección exhaustiva y profesional, asegurándote de que no te pierdes nada importante.',
        },
      ],
      // Antes de la Visita: Preparación
      [
        { type: ContentType.H2, text: 'Antes de la visita: preparación' },
        { type: ContentType.H3, text: 'Qué llevar contigo' },
        { type: ContentType.P, text: 'Checklist impresa o en tu teléfono: Esta guía completa' },
        { type: ContentType.P, text: 'Herramientas básicas:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Linterna o lámpara de teléfono' },
            { type: ContentType.LI, text: 'Cámara o smartphone para fotos/videos' },
            { type: ContentType.LI, text: 'Cinta métrica' },
            { type: ContentType.LI, text: 'Bloc de notas y bolígrafo' },
            { type: ContentType.LI, text: 'Cargador portátil' },
            { type: ContentType.LI, text: 'Lista de preguntas preparadas' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Documentos útiles: Lista de tus requisitos esenciales, presupuesto máximo, información de contacto del agente/propietario.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Timing estratégico' },
        {
          type: ContentType.P,
          text: 'Mejor momento para visitar: Durante el día con luz natural (ver iluminación real), en día de semana (ver rutina normal del barrio), también visita de noche/fin de semana si es posible, después de lluvia (detectar filtraciones).',
        },
        {
          type: ContentType.P,
          text: 'Cuántas visitas hacer: Primera visita (evaluación general), segunda visita (inspección detallada con esta lista), tercera visita opcional (diferentes horarios para evaluar ruido).',
        },
      ],
      // Inspección Exterior
      [
        { type: ContentType.H2, text: 'Inspección exterior' },
        { type: ContentType.H3, text: '1. Primera impresión del edificio/casa' },
        {
          type: ContentType.P,
          text: 'Fachada y estructura: Grietas visibles (pequeñas son normales, grandes son problema), estado de la pintura exterior, condición del techo (tejas rotas, áreas hundidas), canaletas y bajadas de agua (oxidación, obstrucciones), balcones o terrazas (barandas seguras, piso firme).',
        },
        {
          type: ContentType.P,
          text: 'Accesos: Portón o puerta principal segura, iluminación en entrada, escaleras en buen estado, rampas de acceso si las necesitas.',
        },
        {
          type: ContentType.P,
          text: 'Áreas comunes (edificios): Limpieza y mantenimiento, ascensor funcionando, buzones seguros, estado de pasillos y escaleras, señalización de emergencia.',
        },
        {
          type: ContentType.P,
          text: 'Red flags: Estructura visiblemente deteriorada, humedad evidente en paredes exteriores, áreas comunes descuidadas o sucias, falta de iluminación en accesos.',
        },
      ],
      [
        { type: ContentType.H3, text: '2. Seguridad del barrio' },
        {
          type: ContentType.P,
          text: 'Sensación general: ¿Te sientes seguro caminando? Presencia policial visible, cámaras de seguridad, iluminación de calles.',
        },
        {
          type: ContentType.P,
          text: 'Señales de seguridad: Vecinos presentes y actividad normal, comercios abiertos y activos, estado de propiedades vecinas, ausencia de grafiti o vandalismo.',
        },
        {
          type: ContentType.P,
          text: 'Acceso y control: Portero o seguridad (en edificios), sistema de intercomunicador, control de acceso (tarjetas, códigos), cámaras en puntos clave.',
        },
        {
          type: ContentType.P,
          text: 'Preguntas para hacer: ¿Ha habido incidentes de seguridad recientes? ¿Hay patrullas regulares? ¿Los vecinos reportan sentirse seguros?',
        },
      ],
      // Inspección Interior
      [
        { type: ContentType.H2, text: 'Inspección interior: habitación por habitación' },
        { type: ContentType.H3, text: '3. Entrada / hall' },
        {
          type: ContentType.P,
          text: 'Puerta principal: Material sólido (metal o madera maciza mejor que hueca), cerradura de calidad con múltiples puntos, mirilla o sistema de video, marco bien instalado sin espacios, abre y cierra suavemente, cadena de seguridad o traba adicional.',
        },
        {
          type: ContentType.P,
          text: 'Paredes y techo: Pintura en buen estado, sin manchas de humedad, sin grietas grandes, esquinas y molduras bien terminadas.',
        },
        {
          type: ContentType.P,
          text: 'Piso: Firme sin ceder al caminar, sin desniveles peligrosos, tipo de material (baldosa, madera, vinilo), estado general (manchas, daños, desgaste).',
        },
        {
          type: ContentType.P,
          text: 'Toma nota de: Si necesita pintura, cualquier daño que debería repararse antes de mudarte, espacios de almacenamiento disponibles.',
        },
      ],
      [
        { type: ContentType.H3, text: '4. Sala de estar / comedor' },
        {
          type: ContentType.P,
          text: 'Iluminación: Luz natural suficiente (ventanas grandes = más luz), ventanas orientadas (norte = menos luz, sur = más luz), enchufes suficientes y bien ubicados, interruptores funcionando, luminarias incluidas o ausentes.',
        },
        {
          type: ContentType.P,
          text: 'Ventanas: Abren y cierran correctamente, vidrios intactos (sin grietas), marcos sin podredumbre o deformación, cerraduras o seguros funcionando, cortinas o persianas incluidas, sellan bien (prueba de corrientes de aire).',
        },
        {
          type: ContentType.P,
          text: 'Paredes: Agujeros grandes de clavos/tornillos, manchas de humedad (especialmente esquinas), pintura descascarada, moho visible, calidad del acabado.',
        },
        {
          type: ContentType.P,
          text: 'Techos: Manchas amarillas o marrones (filtración de agua), grietas, moho o manchas de humedad, estado de molduras.',
        },
        {
          type: ContentType.P,
          text: 'Pisos: Crujidos al caminar, tablones sueltos o levantados, manchas en alfombras, baldosas rotas o sueltas, uniformidad (sin desniveles).',
        },
        {
          type: ContentType.P,
          text: 'Espacio y distribución: Mide las dimensiones (¿cabe tu mobiliario?), altura del techo, ubicación de enchufes para TV/internet, flujo de circulación.',
        },
        {
          type: ContentType.P,
          text: 'Pruebas activas: Camina por toda la habitación sintiendo el piso, abre y cierra cada ventana, prueba cada enchufe si es posible, busca enchufes para internet/cable.',
        },
      ],
      [
        { type: ContentType.H3, text: '5. Cocina (zona crítica)' },
        { type: ContentType.P, text: 'Esta es una de las áreas MÁS importantes.' },
        {
          type: ContentType.P,
          text: 'Refrigerador: Funciona y enfría adecuadamente, luz interior funciona, puertas cierran herméticamente, sin olores extraños, congelador funcionando, edad aproximada.',
        },
        {
          type: ContentType.P,
          text: 'Estufa/Cocina: Todas las hornallas encienden, horno calienta uniformemente, gas no tiene fugas (olor, sonido), perillas no están sueltas, limpia y sin grasa excesiva.',
        },
        {
          type: ContentType.P,
          text: 'Plomería: Grifos abren/cierran sin gotear, presión de agua adecuada (abre al máximo), agua caliente llega rápido, desagües sin obstrucciones (prueba con agua), debajo del fregadero sin fugas ni humedad, tuberías sin corrosión visible.',
        },
        {
          type: ContentType.P,
          text: 'Gabinetes y almacenamiento: Puertas abren y cierran, bisagras funcionando, interior limpio, suficiente espacio para tus necesidades, estantes estables.',
        },
        {
          type: ContentType.P,
          text: 'Mesadas/Encimeras: Material en buen estado, sin grietas o astillas, sellado correcto (especialmente cerca del fregadero), espacio de trabajo suficiente.',
        },
        {
          type: ContentType.P,
          text: 'Iluminación: Luz sobre área de preparación, luz bajo gabinetes (bonus), enchufes suficientes para electrodomésticos.',
        },
        {
          type: ContentType.P,
          text: 'Ventilación: Ventana que abra o extractor funcionando, sin acumulación visible de grasa, extractor no hace ruido excesivo.',
        },
        {
          type: ContentType.P,
          text: 'Señales de plagas: Trampas o evidencia de roedores, cucarachas (vivas o muertas), hormigas, droppings o excrementos.',
        },
        {
          type: ContentType.P,
          text: 'Red flags críticos: Olor a gas, electrodomésticos rotos sin plan de reemplazo, evidencia de plagas, fugas activas de agua, moho negro visible.',
        },
      ],
      [
        { type: ContentType.H3, text: '6. Baño(s)' },
        {
          type: ContentType.P,
          text: 'Inodoro: Flush completo sin problemas, tanque se llena normalmente, no corre agua constantemente, sin grietas en porcelana, asiento firme, sella bien al piso.',
        },
        {
          type: ContentType.P,
          text: 'Ducha/Bañera: Presión de agua suficiente, agua caliente llega rápido y se mantiene, mezcladora funciona (no solo frío o caliente), desagüe drena rápidamente, cortina o puerta de ducha, sellado de silicona en buen estado, no hay manchas de moho negro, baldosas sin desprenderse, piso de ducha no se hunde.',
        },
        {
          type: ContentType.P,
          text: 'Lavabo: Grifo sin goteo, desagüe drena bien, debajo sin fugas en tubería, lavabo sin grietas, espejo incluido.',
        },
        {
          type: ContentType.P,
          text: 'Ventilación: Extractor funciona (escucha el ruido), ventana que abra (si no hay extractor es CRÍTICO), sin acumulación excesiva de humedad.',
        },
        {
          type: ContentType.P,
          text: 'Almacenamiento: Gabinete bajo lavabo, estantes o botiquín, espacio para artículos de higiene.',
        },
        {
          type: ContentType.P,
          text: 'General: Enchufes (preferiblemente con GFCI para seguridad), iluminación adecuada, calefacción o toallero, privacidad (cerradura funciona).',
        },
        {
          type: ContentType.P,
          text: 'Pruebas importantes: Abre todos los grifos al máximo simultáneamente (presión de agua), flush del inodoro mientras corre la ducha (caída de presión), busca debajo del lavabo con linterna (fugas ocultas).',
        },
        {
          type: ContentType.P,
          text: 'Red flags: Moho negro extenso, sin ventilación (receta para problemas de moho), fugas activas, desagües muy lentos.',
        },
      ],
      [
        { type: ContentType.H3, text: '7. Dormitorios' },
        {
          type: ContentType.P,
          text: 'Tamaño y espacio: Mide dimensiones (¿cabe tu cama y muebles?), altura de techos, forma de la habitación (columnas, irregularidades).',
        },
        {
          type: ContentType.P,
          text: 'Closets/Armarios: Tamaño suficiente, puertas funcionan, barra para colgar, estantes, iluminación interior, sin humedad u olor a moho.',
        },
        {
          type: ContentType.P,
          text: 'Ventanas/Ventilación: Luz natural, ventana abre (ventilación), vista exterior, ruido exterior (prueba con ventana abierta/cerrada), cortinas/persianas incluidas.',
        },
        {
          type: ContentType.P,
          text: 'Enchufes: Suficientes para tus necesidades, bien ubicados (cerca de donde pondrías la cama), funcionando.',
        },
        {
          type: ContentType.P,
          text: 'Privacidad: Puerta cierra correctamente, cerradura funciona, aislamiento acústico (pide silencio y cierra la puerta).',
        },
        {
          type: ContentType.P,
          text: 'Pregunta: ¿Qué lado da el sol? (importante para temperatura), ¿Cuánto ruido se escucha de la calle/vecinos?',
        },
      ],
      [
        { type: ContentType.H3, text: '8. Lavadero (si tiene)' },
        {
          type: ContentType.P,
          text: 'Conexiones: Tomas de agua (caliente y fría), desagüe, enchufes 220V si necesario, espacio suficiente para lavadora/secadora.',
        },
        {
          type: ContentType.P,
          text: 'Máquinas incluidas: Funcionan correctamente, edad y condición, manuales disponibles.',
        },
        { type: ContentType.P, text: 'Ventilación: Especialmente si hay secadora a gas.' },
      ],
      [
        { type: ContentType.H3, text: '9. Espacios de almacenamiento adicional' },
        {
          type: ContentType.P,
          text: 'Revisa: Sótano o bodega, ático o altillo, balcón para almacenamiento, garage o espacio de estacionamiento.',
        },
      ],
      // Sistemas e Instalaciones Críticas
      [
        { type: ContentType.H2, text: 'Sistemas e instalaciones críticas' },
        { type: ContentType.H3, text: '10. Sistema eléctrico' },
        {
          type: ContentType.P,
          text: 'Panel eléctrico: Ubicación accesible, fusibles/breakers modernos (no fusibles antiguos de cartucho), etiquetado claro, sin olor a quemado, sin cables expuestos.',
        },
        {
          type: ContentType.P,
          text: 'Enchufes: Cantidad suficiente en cada habitación, funcionan todos (lleva un cargador para probar), no están flojos, tipo de enchufe (2 o 3 patas con tierra), GFCI en cocina/baño (seguridad).',
        },
        {
          type: ContentType.P,
          text: 'Iluminación: Todas las luces funcionan, interruptores responden, suficiente iluminación general.',
        },
        {
          type: ContentType.P,
          text: 'Red flags: Olor a quemado, chispas o zumbidos, panel eléctrico muy antiguo, cables expuestos o pelados, enchufes muy calientes al tacto.',
        },
      ],
      [
        { type: ContentType.H3, text: '11. Calefacción y aire acondicionado' },
        {
          type: ContentType.P,
          text: 'Calefacción: Tipo de sistema (central, radiadores, eléctrico), enciende y calienta, termostato funciona, ruido al operar, edad del sistema, última mantención.',
        },
        {
          type: ContentType.P,
          text: 'Aire acondicionado: Tipo (central, split, ventana), funciona en todos los cuartos, enfría efectivamente, ruido, filtros limpios, edad y mantención.',
        },
        {
          type: ContentType.P,
          text: 'Ventilación general: Ventanas abren para ventilación natural, extractores en cocina y baño, circulación de aire.',
        },
        {
          type: ContentType.P,
          text: 'Preguntas importantes: ¿Quién paga el mantenimiento? ¿Con qué frecuencia se hace servicio? ¿Costo promedio mensual de calefacción/enfriamiento?',
        },
      ],
      [
        { type: ContentType.H3, text: '12. Aislamiento y eficiencia energética' },
        {
          type: ContentType.P,
          text: 'Ventanas: Doble vidrio (mejor aislamiento), sellan correctamente, sin corrientes de aire (prueba con mano).',
        },
        { type: ContentType.P, text: 'Puertas: Burlete en buen estado, cierran herméticamente.' },
        {
          type: ContentType.P,
          text: 'Paredes: Aislación adecuada (golpea suavemente, ¿suena hueco?), temperatura al tacto (muy fría en invierno = mal aislamiento).',
        },
        {
          type: ContentType.P,
          text: 'Impacto financiero: Una propiedad mal aislada puede costar $100-300 más por mes en calefacción/enfriamiento.',
        },
      ],
      [
        { type: ContentType.H3, text: '13. Internet y conectividad' },
        { type: ContentType.P, text: 'Crucial en era del trabajo remoto.' },
        {
          type: ContentType.P,
          text: 'Averigua: Proveedores disponibles en el edificio/zona, velocidades ofrecidas, costo mensual, ubicación de conexión (¿puedes tener WiFi en toda la propiedad?), fibra óptica disponible (ideal).',
        },
        {
          type: ContentType.P,
          text: 'Cobertura celular: Prueba tu teléfono en diferentes habitaciones, verifica todas las compañías que usas.',
        },
      ],
      // Pruebas Específicas
      [
        { type: ContentType.H2, text: 'Pruebas específicas durante la visita' },
        { type: ContentType.H3, text: 'Tests activos recomendados' },
        {
          type: ContentType.P,
          text: 'Test de presión de agua: Abre varios grifos simultáneamente, flush inodoro mientras corre ducha, verifica si mantiene presión.',
        },
        {
          type: ContentType.P,
          text: 'Test de drenaje: Llena lavabo y bañera, deja drenar completamente, debería drenar rápido sin burbujeos.',
        },
        {
          type: ContentType.P,
          text: 'Test de ruido: Pide silencio total, escucha ruidos de vecinos/calle/cañerías, cierra puertas interiores para probar aislamiento acústico.',
        },
        {
          type: ContentType.P,
          text: 'Test de olor: Respira profundo en cada habitación, especialmente en closets y baños, olores persistentes son difíciles de eliminar.',
        },
        {
          type: ContentType.P,
          text: 'Test de luz natural: Anota qué habitaciones tienen más luz, considera orientación (norte, sur, este, oeste), piensa en diferentes estaciones.',
        },
        {
          type: ContentType.P,
          text: 'Test de temperatura: ¿La temperatura es confortable ahora? Pregunta cómo es en invierno/verano, habitaciones más frías/calientes.',
        },
      ],
      // Documentación
      [
        { type: ContentType.H2, text: 'Documentación: esencial' },
        { type: ContentType.H3, text: 'Fotos y videos' },
        {
          type: ContentType.P,
          text: 'Toma fotos de: Vista general de cada habitación (4 ángulos), todos los daños existentes (primer planos), lecturas de medidores (agua, luz, gas), manchas/grietas/desperfectos, electrodomésticos y su estado, closets y áreas de almacenamiento.',
        },
        {
          type: ContentType.P,
          text: 'Video walkthrough: Recorre toda la propiedad hablando, menciona fecha y hora, abre y cierra cosas demostrando funcionamiento, captura sonidos (agua corriendo, extractores).',
        },
        {
          type: ContentType.P,
          text: 'Por qué es crítico: Esta documentación te protege al momento de mudarte y recuperar tu depósito.',
        },
      ],
      // Preguntas Críticas
      [
        { type: ContentType.H2, text: 'Preguntas críticas para hacer durante la visita' },
        { type: ContentType.H3, text: 'Al propietario/agente' },
        { type: ContentType.P, text: 'Sobre la propiedad:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: '¿Cuándo fue la última renovación/reparación importante?',
            },
            { type: ContentType.LI, text: '¿Qué edad tienen los electrodomésticos?' },
            { type: ContentType.LI, text: '¿Ha habido problemas de plomería/electricidad?' },
            { type: ContentType.LI, text: '¿Cuándo fue la última inspección de plagas?' },
            { type: ContentType.LI, text: '¿Por qué se va el inquilino actual?' },
            { type: ContentType.LI, text: '¿Cuánto tiempo ha estado vacía?' },
            { type: ContentType.LI, text: '¿Se harán reparaciones antes de la mudanza?' },
            { type: ContentType.LI, text: '¿Qué está incluido (electrodomésticos, muebles)?' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Sobre costos: ¿Cuál es el costo promedio de servicios mensuales? ¿Gastos comunes incluyen qué exactamente? ¿Ha habido aumentos significativos de costo recientemente?',
        },
        {
          type: ContentType.P,
          text: 'Sobre el edificio: ¿Hay proyectos de construcción o renovación planeados? ¿Cuál es el horario del portero/seguridad? ¿Qué amenidades están disponibles y hay costo adicional? ¿Hay problemas conocidos con vecinos?',
        },
      ],
      [
        { type: ContentType.H3, text: 'A los vecinos (si puedes)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: '¿Cómo es vivir aquí?' },
            { type: ContentType.LI, text: '¿El propietario responde rápido a problemas?' },
            { type: ContentType.LI, text: '¿Ha habido problemas de seguridad?' },
            { type: ContentType.LI, text: '¿Cómo es el nivel de ruido?' },
            { type: ContentType.LI, text: '¿Recomendarías vivir aquí?' },
          ],
        },
      ],
      // Red Flags
      [
        { type: ContentType.H2, text: 'Red flags - señales de alerta' },
        { type: ContentType.H3, text: 'Rechaza o exige reparaciones si ves' },
        {
          type: ContentType.P,
          text: 'DEALBREAKERS (No alquiles): Moho negro extenso, problemas estructurales graves, sin calefacción funcional, plagas evidentes sin plan de solución, instalación eléctrica peligrosa, fugas de gas.',
        },
        {
          type: ContentType.P,
          text: 'NEGOCIABLES (Exige reparación antes de mudarte): Electrodomésticos rotos, grifos goteando, ventanas que no cierran, pintura descascarada, pequeñas filtraciones.',
        },
      ],
      // Después de la Visita
      [
        { type: ContentType.H2, text: 'Después de la visita' },
        { type: ContentType.H3, text: 'Checklist de seguimiento' },
        {
          type: ContentType.P,
          text: 'Dentro de 24 horas: Revisa tus fotos y notas, organiza tus impresiones, compara con otras propiedades, verifica que cumple tus requisitos mínimos.',
        },
        {
          type: ContentType.P,
          text: 'Antes de comprometerte: Segunda visita si es necesario, verifica referencias del propietario, investiga el barrio online, calcula costos reales totales, lee el contrato cuidadosamente.',
        },
        {
          type: ContentType.P,
          text: 'Al firmar: Anexa al contrato lista de daños existentes con fotos, obtén compromiso por escrito de reparaciones prometidas, confirma fecha de reparaciones, programa inspección final antes de mudarte.',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Una visita completa y metódica puede tomar 45-90 minutos, pero este tiempo invertido puede ahorrarte miles de dólares y enormes dolores de cabeza. No te dejes presionar para "decidir rápido" sin una inspección completa.',
        },
        { type: ContentType.P, text: 'Recuerda:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Esta será tu casa; mereces que esté en buenas condiciones',
            },
            {
              type: ContentType.LI,
              text: 'Los problemas no detectados ahora serán TUS problemas después',
            },
            { type: ContentType.LI, text: 'La documentación fotográfica te protege legalmente' },
            {
              type: ContentType.LI,
              text: 'Un propietario que no quiere que inspecciones cuidadosamente es una red flag',
            },
            {
              type: ContentType.LI,
              text: 'Está bien rechazar una propiedad que no pasa la inspección',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'No comprometas tu seguridad, salud o bienestar financiero por apuro o emoción. La propiedad correcta vale la espera.',
        },
      ],
    ],
  },
  {
    id: 7,
    title: 'Inspecciona bien la propiedad',
    excerpt:
      'Verifica el estado de las instalaciones, humedad, grietas, electricidad y plomería. Visita en diferentes horarios para evaluar el ruido y actividad del barrio.',
    category: ArticleType.TIPS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Inspeccionar cuidadosamente una propiedad antes de firmar un contrato puede ser la diferencia entre vivir cómodamente o lidiar con problemas costosos durante meses o años. Muchos inquilinos pasan por alto detalles importantes en su entusiasmo por asegurar un lugar, solo para descubrir después problemas que pudieron haber detectado con una inspección más exhaustiva. Esta guía te enseñará cómo realizar una inspección profesional, qué buscar, y cómo evaluar si una propiedad vale tu inversión.',
        },
      ],
      // Por Qué Es Crítico Inspeccionar Bien
      [
        { type: ContentType.H2, text: 'Por Qué Es Crítico Inspeccionar Bien' },
        { type: ContentType.H3, text: 'Razones Principales' },
        {
          type: ContentType.P,
          text: 'Protección financiera: Evitas gastos inesperados en reparaciones, documentas problemas existentes para no perder tu depósito, identificas costos ocultos (altas cuentas de servicios por mal aislamiento).',
        },
        {
          type: ContentType.P,
          text: 'Salud y seguridad: Detectas moho, humedad o problemas que afectan tu salud, verificas que instalaciones eléctricas y de gas sean seguras, aseguras ventilación adecuada.',
        },
        {
          type: ContentType.P,
          text: 'Calidad de vida: Evalúas ruido del barrio y vecinos, confirmas que tengas suficiente espacio y luz, verificas que todo funcione correctamente.',
        },
        {
          type: ContentType.P,
          text: 'Poder de negociación: Los problemas detectados te dan argumentos para negociar precio, puedes exigir reparaciones antes de mudarte, tienes información para tomar una decisión informada.',
        },
      ],
      // Preparación
      [
        { type: ContentType.H2, text: 'Preparación: Antes de la Inspección' },
        { type: ContentType.H3, text: 'Qué Llevar' },
        { type: ContentType.P, text: 'Herramientas esenciales:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Smartphone con cámara (fotos y videos)' },
            { type: ContentType.LI, text: 'Linterna potente' },
            { type: ContentType.LI, text: 'Cinta métrica' },
            { type: ContentType.LI, text: 'Esta guía impresa o en tu teléfono' },
            { type: ContentType.LI, text: 'Cargador de teléfono para probar enchufes' },
            { type: ContentType.LI, text: 'Bloc de notas y bolígrafo' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Documentos útiles: Lista de tus requisitos no negociables, preguntas preparadas, información del propietario/agente.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Mejor Momento Para Inspeccionar' },
        {
          type: ContentType.P,
          text: 'Hora ideal: Durante el día con luz natural (10am-4pm), día de semana para ver tráfico normal, también visita de noche si es posible, después de lluvia (para detectar filtraciones).',
        },
        {
          type: ContentType.P,
          text: 'Cuánto tiempo necesitas: Primera visita general (30-45 minutos), inspección detallada (60-90 minutos). No te apresures; es una decisión importante.',
        },
      ],
      // Inspección de Instalaciones
      [
        { type: ContentType.H2, text: 'Inspección de Instalaciones: Lo Técnico' },
        { type: ContentType.H3, text: '1. Sistema Eléctrico' },
        {
          type: ContentType.P,
          text: 'Panel eléctrico / Caja de fusibles: Ubicación accesible, tipo (interruptores modernos vs fusibles antiguos), etiquetado claro de cada circuito, sin olor a quemado o cables expuestos, capacidad suficiente para tus necesidades.',
        },
        {
          type: ContentType.P,
          text: 'Enchufes: Cantidad suficiente en cada habitación, tipo de enchufe (2 o 3 patas), GFCI en cocina y baño (para seguridad con agua), funcionan todos (prueba con tu cargador), no están flojos o dañados, no se sienten calientes al tacto.',
        },
        {
          type: ContentType.P,
          text: 'Prueba simple: Lleva un cargador de teléfono, prueba CADA enchufe de la propiedad, anota cuáles no funcionan.',
        },
        {
          type: ContentType.P,
          text: 'Iluminación: Todas las lámparas encienden, interruptores responden correctamente, suficiente iluminación en cada espacio.',
        },
        {
          type: ContentType.P,
          text: 'Red flags: Chispas o zumbidos al encender luces, olor a quemado cerca de enchufes, enchufes muy calientes, luces parpadeantes constantemente, panel eléctrico muy antiguo u oxidado.',
        },
      ],
      [
        { type: ContentType.H3, text: '2. Plomería y Agua' },
        {
          type: ContentType.P,
          text: 'Test de presión de agua: Abre el grifo de la ducha al máximo, mientras corre abre otro grifo en otra habitación, flush del inodoro. ¿Se mantiene la presión?',
        },
        {
          type: ContentType.P,
          text: 'Agua caliente: Abre el grifo de agua caliente, cronometra cuánto tarda en salir caliente (debería ser menos de 2 minutos), deja correr 5 minutos para verificar que se mantiene, verifica en varios puntos de la casa.',
        },
        {
          type: ContentType.P,
          text: 'Preguntas importantes: ¿Tipo de calentador? (tanque, instantáneo, solar), ¿Capacidad suficiente? ¿Edad del calentador? ¿Cuándo fue el último mantenimiento?',
        },
        {
          type: ContentType.P,
          text: 'Test de drenaje: Llena el lavabo con agua, quita el tapón y observa cómo drena, debería vaciar en menos de 1 minuto, no debería hacer ruidos de burbujeo excesivo.',
        },
        {
          type: ContentType.P,
          text: 'Fugas y goteos: Inspecciona debajo de lavabos (usa linterna, busca manchas de agua, humedad o moho), verifica grifos (¿gotean cuando están cerrados?), inodoros (¿suena agua corriendo constantemente? ¿hay fugas en la base?).',
        },
        {
          type: ContentType.P,
          text: 'Red flags de plomería: Múltiples goteos no reparados, presión de agua muy baja, desagües muy lentos, olor a aguas residuales, manchas de humedad extensas, moho negro visible.',
        },
      ],
      [
        { type: ContentType.H3, text: '3. Humedad y Filtraciones' },
        {
          type: ContentType.P,
          text: 'Señales visuales de humedad en paredes: Manchas oscuras o decoloración, pintura descascarada o burbujeante, papel tapiz despegándose, manchas blancas cristalizadas, moho visible (puntos negros, verdes o blancos).',
        },
        {
          type: ContentType.P,
          text: 'Señales en techos: Manchas amarillentas o marrones, abultamientos en el cielo raso, grietas con humedad, manchas que crecen después de lluvia.',
        },
        {
          type: ContentType.P,
          text: 'Señales en pisos: Manchas oscuras en alfombras, tablones de madera levantados o combados, baldosas sueltas, olor a humedad.',
        },
        {
          type: ContentType.P,
          text: 'Test de humedad simple: Coloca tu mano en la pared por 30 segundos. ¿Se siente fría y húmeda? = problema.',
        },
        {
          type: ContentType.P,
          text: 'Por qué es crítico: Afecta tu salud (alergias, asma, problemas respiratorios), causa moho tóxico, daña tus pertenencias, reduce calidad del aire, es costoso y difícil de eliminar.',
        },
        {
          type: ContentType.P,
          text: 'Si detectas humedad: Pregunta sobre su origen, exige que se repare ANTES de mudarte, si es extenso considera no alquilar, documenta con fotos fechadas.',
        },
      ],
      [
        { type: ContentType.H3, text: '4. Electricidad y Cableado' },
        {
          type: ContentType.P,
          text: 'Cables visibles: Cables expuestos sin protección, empalmes caseros sin caja de conexión, cables pelados o deteriorados, extensiones eléctricas permanentes.',
        },
        {
          type: ContentType.P,
          text: 'Instalaciones antiguas: Enchufes de 2 patas sin tierra, cables de tela (muy antiguos), fusibles de cartucho (obsoletos), interruptores antiguos que no funcionan bien.',
        },
        {
          type: ContentType.P,
          text: 'Sobrecarga: Múltiples regletas enchufadas en un solo punto, enchufes con demasiados adaptadores, cables calientes, olor a plástico quemado.',
        },
        {
          type: ContentType.P,
          text: 'Por qué importa: Riesgo de incendio, electrodomésticos pueden dañarse, no soporta aparatos modernos.',
        },
      ],
      [
        { type: ContentType.H3, text: '5. Grietas Estructurales' },
        {
          type: ContentType.P,
          text: 'Grietas normales (aceptables): Líneas muy finas (ancho de cabello), en esquinas de puertas y ventanas, superficiales en yeso o pintura, no crecen con el tiempo, causadas por asentamiento normal.',
        },
        {
          type: ContentType.P,
          text: 'Grietas preocupantes: Más anchas que 5mm, en forma de escalera en paredes de ladrillo, diagonales desde las esquinas, horizontales en muros de carga, que atraviesan varios pisos, con humedad asociada, puertas y ventanas que no cierran bien cerca de grietas.',
        },
        {
          type: ContentType.P,
          text: 'Test de la moneda: Intenta meter una moneda en la grieta. Si entra completamente = grieta seria.',
        },
        {
          type: ContentType.P,
          text: 'Red flags estructurales: Grietas anchas y profundas, grietas que cruzan techo y paredes, pisos inclinados notoriamente, puertas que no cierran por deformación del marco, ventanas atascadas o deformadas.',
        },
      ],
      // Evaluación del Barrio
      [
        { type: ContentType.H2, text: 'Evaluación del Barrio: Diferentes Horarios' },
        {
          type: ContentType.P,
          text: 'Por qué visitar en varios momentos: El barrio puede ser muy diferente según el horario. Una zona tranquila de día puede ser ruidosa de noche, o viceversa.',
        },
        { type: ContentType.H3, text: 'Horarios Clave Para Evaluar' },
        {
          type: ContentType.P,
          text: 'Mañana temprano (7-9am): Observa tráfico de hora pico, ruido de vecinos preparándose, disponibilidad de estacionamiento, transporte público (frecuencia, puntualidad), comercios abriendo, actividad del barrio.',
        },
        {
          type: ContentType.P,
          text: 'Día laboral (10am-5pm): Nivel de actividad general, seguridad percibida cuando está más vacío, ruidos industriales o comerciales, mantenimiento del barrio, acceso a comercios y servicios.',
        },
        {
          type: ContentType.P,
          text: 'Tarde-noche (6-10pm): Tráfico de regreso del trabajo, ruido de vecinos (música, voces, TV), bares o discotecas (ruido nocturno), iluminación de calles, sensación de seguridad, disponibilidad de estacionamiento.',
        },
        {
          type: ContentType.P,
          text: 'Fin de semana: Sábado (actividad de limpieza y mantenimiento, eventos del barrio, familias y niños), Domingo (más tranquilo generalmente, verdadera atmósfera del barrio en reposo), noche de fin de semana (ruido de fiestas o reuniones, bares y vida nocturna, seguridad nocturna real).',
        },
      ],
      [
        { type: ContentType.H3, text: 'Checklist de Evaluación del Barrio' },
        {
          type: ContentType.P,
          text: 'Ruido: Tráfico (autos, motos, camiones), vecinos (música, conversaciones, niños), comercios (bares, restaurantes), construcción cercana, aviones/trenes/sirenas.',
        },
        {
          type: ContentType.P,
          text: 'Seguridad: Personas en la calle (¿te sientes seguro?), iluminación de calles, presencia policial, comercios abiertos o cerrados, actividad sospechosa.',
        },
        {
          type: ContentType.P,
          text: 'Actividad del barrio: Familias, niños, mascotas (generalmente señal positiva), vecinos que se saludan (comunidad cohesionada), comercios activos, mantenimiento visible de propiedades.',
        },
        {
          type: ContentType.P,
          text: 'Servicios disponibles: Supermercados, farmacias, transporte público, estacionamiento, parques o áreas verdes.',
        },
      ],
      // Documentación
      [
        { type: ContentType.H2, text: 'Documentación: Tu Mejor Protección' },
        { type: ContentType.H3, text: 'Por Qué Documentar' },
        {
          type: ContentType.OL,
          children: [
            { type: ContentType.LI, text: 'Protege tu depósito: Prueba del estado inicial' },
            { type: ContentType.LI, text: 'Base para negociación: Argumentos para reducir precio' },
            { type: ContentType.LI, text: 'Referencia futura: Comparar con otros lugares' },
            { type: ContentType.LI, text: 'Evidencia legal: Si hay disputas' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: 'Qué y Cómo Documentar' },
        {
          type: ContentType.P,
          text: 'Fotografías detalladas: Toma fotos de vista general de cada habitación (4 ángulos), todos los desperfectos (primer plano), electrodomésticos con números de serie visibles, lecturas de medidores (agua, luz, gas), manchas/grietas/humedad, estado de pisos y paredes, ventanas y puertas, instalaciones (grifos, inodoros, ducha), áreas exteriores.',
        },
        {
          type: ContentType.P,
          text: 'Técnica correcta: Buena iluminación, fotos claras sin zoom excesivo, incluye referencia de tamaño (regla, moneda), configura fecha y hora en cámara.',
        },
        {
          type: ContentType.P,
          text: 'Video walkthrough: Graba entrada y número de propiedad, recorre cada habitación sistemáticamente, narra lo que ves, abre y cierra cosas (ventanas, grifos, puertas), captura sonidos (agua corriendo, ruidos externos), menciona fecha y hora verbalmente. Duración ideal: 10-15 minutos completos.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Organización de Documentación' },
        {
          type: ContentType.P,
          text: 'Carpeta digital: Fotos organizadas por habitación, video completo, lista de problemas en Excel/Google Sheets, copias de comunicaciones con propietario.',
        },
        {
          type: ContentType.P,
          text: 'Respaldo: Copia en nube (Google Drive, Dropbox), envíate las fotos por email (fecha automática), USB de respaldo.',
        },
      ],
      // Señales de Alerta
      [
        { type: ContentType.H2, text: 'Señales de Alerta Durante la Inspección' },
        { type: ContentType.H3, text: 'Red Flags Absolutos (No Alquiles)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Instalaciones eléctricas peligrosas expuestas' },
            { type: ContentType.LI, text: 'Olor fuerte a gas' },
            { type: ContentType.LI, text: 'Moho negro extenso' },
            { type: ContentType.LI, text: 'Problemas estructurales graves' },
            { type: ContentType.LI, text: 'Sin calefacción funcional en clima frío' },
            { type: ContentType.LI, text: 'Plaga de insectos/roedores activa' },
            { type: ContentType.LI, text: 'Sin agua caliente o presión adecuada' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: 'Red Flags Negociables (Exige Reparación)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Electrodomésticos no funcionan' },
            { type: ContentType.LI, text: 'Grifos gotean' },
            { type: ContentType.LI, text: 'Pintura muy deteriorada' },
            { type: ContentType.LI, text: 'Ventanas no cierran bien' },
            { type: ContentType.LI, text: 'Pequeñas filtraciones' },
            { type: ContentType.LI, text: 'Desagües lentos' },
            { type: ContentType.LI, text: 'Falta de enchufes' },
          ],
        },
      ],
      [
        { type: ContentType.H3, text: 'Actitudes Sospechosas del Propietario' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Se molesta por tu inspección detallada' },
            { type: ContentType.LI, text: 'Apresura la visita' },
            { type: ContentType.LI, text: 'Evita mostrarte ciertas áreas' },
            { type: ContentType.LI, text: 'Minimiza problemas obvios' },
            { type: ContentType.LI, text: 'Promete reparaciones sin ponerlo por escrito' },
            { type: ContentType.LI, text: 'No tiene respuestas sobre antigüedad/mantenimiento' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Si ves esto: Considera buscar otra opción. Un propietario que oculta o minimiza ahora será peor después.',
        },
      ],
      // Después de la Inspección
      [
        { type: ContentType.H2, text: 'Después de la Inspección: Siguientes Pasos' },
        { type: ContentType.H3, text: 'Revisión Inmediata (Dentro de 24 horas)' },
        {
          type: ContentType.P,
          text: 'Evalúa tus hallazgos: Revisa fotos y video, organiza lista de problemas por prioridad, calcula costo estimado de problemas, decide si son dealbreakers o negociables.',
        },
        {
          type: ContentType.P,
          text: 'Compara con tus requisitos: ¿Cumple tus necesidades básicas? ¿Los problemas son aceptables? ¿El barrio funciona para tu estilo de vida?',
        },
      ],
      [
        { type: ContentType.H3, text: 'Comunicación con el Propietario' },
        {
          type: ContentType.P,
          text: 'Si decides proceder, envía un email listando problemas detectados durante la inspección. Clasifica por prioridad (alta/media/baja) y solicita confirmación de que se repararán antes de la fecha de mudanza. Adjunta fotos de referencia.',
        },
        {
          type: ContentType.P,
          text: 'Obtén compromisos por escrito: Nunca confíes solo en promesas verbales, exige email o adendum al contrato, especifica fechas de reparación, programa inspección final antes de mudarte.',
        },
      ],
      // Lista de Verificación Final
      [
        { type: ContentType.H2, text: 'Lista de Verificación Final' },
        { type: ContentType.P, text: 'Antes de firmar el contrato, confirma:' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Inspección completa realizada' },
            { type: ContentType.LI, text: 'Problemas documentados con fotos/video' },
            { type: ContentType.LI, text: 'Lista de reparaciones acordada por escrito' },
            { type: ContentType.LI, text: 'Visitado el barrio en diferentes horarios' },
            { type: ContentType.LI, text: 'Hablado con vecinos' },
            { type: ContentType.LI, text: 'Todos los servicios funcionan' },
            { type: ContentType.LI, text: 'No hay red flags graves' },
            { type: ContentType.LI, text: 'Precio justo considerando el estado' },
            { type: ContentType.LI, text: 'Contrato incluye anexo con estado de la propiedad' },
            { type: ContentType.LI, text: 'Te sientes cómodo con tu decisión' },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Una inspección exhaustiva puede tomar varias horas entre múltiples visitas, pero este tiempo invertido puede ahorrarte miles de dólares en problemas y años de arrepentimiento. No te dejes presionar para decidir rápido sin inspeccionar adecuadamente.',
        },
        { type: ContentType.P, text: 'Puntos clave:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: 'Lleva herramientas: Linterna, cámara, cinta métrica, checklist',
            },
            {
              type: ContentType.LI,
              text: 'Inspecciona sistemáticamente: No confíes en "se ve bien"',
            },
            {
              type: ContentType.LI,
              text: 'Prueba todo: Grifos, enchufes, electrodomésticos, ventanas',
            },
            { type: ContentType.LI, text: 'Busca humedad: Problema más común y costoso' },
            {
              type: ContentType.LI,
              text: 'Visita en diferentes horarios: El barrio puede cambiar radicalmente',
            },
            { type: ContentType.LI, text: 'Documenta TODO: Fotos, video, lista escrita' },
            { type: ContentType.LI, text: 'No ignores red flags: Confía en tu instinto' },
            {
              type: ContentType.LI,
              text: 'Exige reparaciones por escrito: Promesas verbales no valen',
            },
            {
              type: ContentType.LI,
              text: 'Tómate tu tiempo: No te apresures en decisión tan importante',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Recuerda: Un propietario que tiene una propiedad en buen estado no tendrá problema con que inspecciones cuidadosamente. Si se molesta o apresura, es una señal de alerta.',
        },
        {
          type: ContentType.P,
          text: 'Tu futuro hogar debe ser seguro, funcional y cómodo. Una inspección exhaustiva asegura que así sea.',
        },
      ],
    ],
  },
  {
    id: 8,
    title: 'Negocia el precio',
    excerpt:
      'No aceptes la primera oferta. Los propietarios esperan negociación. Si hay problemas menores, úsalos como argumentos para reducir el precio.',
    category: ArticleType.TIPS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'La mayoría de las personas asume que el precio de alquiler publicado es fijo e inamovible. Este es uno de los errores más costosos que puedes cometer como inquilino. La realidad es que casi todo en el mercado de alquileres es negociable, y los propietarios experimentados esperan cierto nivel de regateo. No negociar puede costarte cientos o incluso miles de dólares durante el período de tu contrato.',
        },
      ],
      // Por Qué Deberías Negociar
      [
        { type: ContentType.H2, text: 'Por Qué Deberías Negociar' },
        { type: ContentType.H3, text: 'Razones para negociar siempre' },
        {
          type: ContentType.P,
          text: 'Beneficio financiero directo: Ahorro mensual que se multiplica durante todo el contrato, reducción de costos iniciales (depósito, primer mes), inclusión de servicios o amenidades.',
        },
        {
          type: ContentType.P,
          text: 'Establece precedente: Demuestra que no eres un inquilino pasivo, mejor posición para futuras negociaciones (renovaciones), el propietario te tomará más en serio.',
        },
        {
          type: ContentType.P,
          text: 'Estándar del mercado: Los propietarios suelen publicar precios un 5-15% más altos esperando negociación, agentes inmobiliarios tienen margen de maniobra, no negociar significa que estás subsidiando a otros inquilinos que sí lo hacen.',
        },
        {
          type: ContentType.P,
          text: 'Detecta actitud del propietario: Un propietario inflexible en precio puede ser inflexible en todo, la negociación te muestra cómo será trabajar con esta persona.',
        },
      ],
      // Cuándo Es El Mejor Momento
      [
        { type: ContentType.H2, text: 'Cuándo Es El Mejor Momento Para Negociar' },
        { type: ContentType.H3, text: 'Situaciones con mayor poder de negociación' },
        {
          type: ContentType.P,
          text: 'Alta oferta: La propiedad lleva más de 30 días sin alquilar, temporada baja, mercado con muchas propiedades disponibles, final de mes, recesión económica o incertidumbre.',
        },
        {
          type: ContentType.P,
          text: 'Perfil de inquilino fuerte: Excelente historial crediticio, ingresos estables y verificables (3x la renta), referencias impecables, sin mascotas, disposición para contrato largo plazo, capacidad de pagar varios meses adelantados.',
        },
        {
          type: ContentType.P,
          text: 'Defectos detectados: Problemas menores en la propiedad, electrodomésticos viejos, necesita pintura o reparaciones cosméticas, ubicación menos deseable, sin amenidades que sí tienen otras propiedades.',
        },
        { type: ContentType.H3, text: 'Situaciones con menor poder' },
        {
          type: ContentType.P,
          text: 'Difícil negociar: Propiedad recién publicada, múltiples interesados compitiendo, temporada alta, mercado muy competitivo, tu perfil crediticio débil, tienes mascotas en edificio con restricciones.',
        },
        {
          type: ContentType.P,
          text: 'Importante: Incluso en mercados difíciles, siempre vale la pena intentar. El peor que puede pasar es que digan no.',
        },
      ],
      // Preparación
      [
        { type: ContentType.H2, text: 'Preparación: Antes de Negociar' },
        { type: ContentType.H3, text: 'Investiga el mercado' },
        {
          type: ContentType.P,
          text: 'Precios comparables: Busca 5-10 propiedades similares en la zona, mismo tamaño y amenidades, anota rango de precios, calcula precio promedio.',
        },
        {
          type: ContentType.P,
          text: 'Tiempo en mercado: ¿Cuánto tiempo lleva publicada? ¿Ha bajado el precio? ¿Hay muchas propiedades vacías en el edificio?',
        },
        {
          type: ContentType.P,
          text: 'Condiciones del mercado: ¿Es un mercado de propietarios o inquilinos? Tendencias recientes, factores económicos locales.',
        },
        {
          type: ContentType.P,
          text: 'Herramientas útiles: Portales inmobiliarios, Google Maps, grupos de Facebook del barrio, hablar con vecinos.',
        },
        { type: ContentType.H3, text: 'Define tu estrategia' },
        {
          type: ContentType.P,
          text: 'Tu presupuesto máximo real: No lo reveles inmediatamente, deja margen de negociación.',
        },
        {
          type: ContentType.P,
          text: 'Tu oferta inicial: Generalmente 10-20% menos que el precio pedido, debe ser justificable.',
        },
        {
          type: ContentType.P,
          text: 'Tu punto medio aceptable: Dónde estarías contento cerrando el trato.',
        },
        {
          type: ContentType.P,
          text: 'Alternativas: Si no pueden bajar precio, ¿qué más aceptarías? Inclusión de servicios, mejoras, estacionamiento.',
        },
        {
          type: ContentType.P,
          text: 'Tu BATNA: ¿Cuál es tu plan B si no llegas a acuerdo? Tener opciones te da poder.',
        },
      ],
      // 10 Estrategias
      [
        { type: ContentType.H2, text: 'Estrategias de Negociación Específicas' },
        { type: ContentType.H3, text: 'Estrategia 1: Usar Defectos Como Palanca' },
        {
          type: ContentType.P,
          text: 'Durante tu inspección, detectaste varios problemas. Úsalos como argumentos para reducir precio. Menciona problemas específicos (cocina, baño, ventanas, alfombra) y propón un precio que refleje el estado actual.',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Planteas argumentos objetivos, documentaste los problemas con fotos, das razón lógica para la reducción.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 2: Comparación de Mercado' },
        {
          type: ContentType.P,
          text: 'Trae evidencia de propiedades comparables más baratas. Muestra ejemplos concretos: direcciones, precios, características similares. Demuestra que el precio está por encima del promedio del mercado.',
        },
        {
          type: ContentType.P,
          text: 'Preparación: Imprime o muestra screenshots, asegúrate que sean verdaderamente comparables, ten al menos 3-5 ejemplos.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 3: Compromiso de Largo Plazo' },
        {
          type: ContentType.P,
          text: 'Ofrece firmar contrato más largo a cambio de mejor precio. Para el propietario significa: ingreso garantizado por 2 años completos, sin gastos de búsqueda, sin período de vacante, sin riesgo de rotación.',
        },
        {
          type: ContentType.P,
          text: 'Variantes: 18 meses con renovación, cláusula de aumento predecible, sin aumentos durante todo el período.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 4: Pago Adelantado' },
        {
          type: ContentType.P,
          text: 'Si tienes el capital, ofrece pagar varios meses adelantados. Esto les da flujo de caja inmediato, cero riesgo de impago, tranquilidad financiera.',
        },
        {
          type: ContentType.P,
          text: 'Opciones: 3 meses por 5% descuento, 6 meses por 8% descuento, 12 meses por 10% descuento.',
        },
        {
          type: ContentType.P,
          text: 'ADVERTENCIA: Solo hazlo si confías completamente en el propietario, verifica que es el dueño legítimo, todo por escrito, no comprometas tu fondo de emergencia.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 5: Solicitar Inclusiones Extras' },
        {
          type: ContentType.P,
          text: 'Si no pueden bajar precio, pide que incluyan extras que te ahorran dinero: Internet, estacionamiento, gastos comunes, cable básico, lavadora/secadora sin costo extra.',
        },
        {
          type: ContentType.P,
          text: 'Calcula el valor: Si incluyen internet ($50) + estacionamiento ($75), es efectivamente como reducir la renta.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 6: Timing Estratégico' },
        {
          type: ContentType.P,
          text: 'Ofrece flexibilidad en fechas a cambio de mejor precio. Si la propiedad ha estado disponible semanas, puedes mudarte inmediatamente y ahorrarles otro mes de vacante.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 7: Perfil de Bajo Riesgo' },
        {
          type: ContentType.P,
          text: 'Presenta tu perfil como inquilino ideal: crédito excelente, ingresos estables, referencias impecables, sin mascotas, no fumas, profesional responsable. Los mejores inquilinos merecen las mejores tarifas.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 8: Negociación Silenciosa (Ancla Baja)' },
        {
          type: ContentType.P,
          text: 'Establece un "ancla" baja para que cualquier punto medio parezca razonable. Ejemplo: Propietario pide $1,300 → Ofreces $1,050 → Contraoferta $1,250 → Tú $1,100 → Final $1,150-1,200.',
        },
        {
          type: ContentType.P,
          text: 'Psicología: Cuando empiezas muy bajo, el punto medio parece un compromiso razonable para ambos.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 9: Paquete de Beneficios Múltiples' },
        {
          type: ContentType.P,
          text: 'Ofrece varios beneficios juntos: precio reducido + contrato largo + pago adelantado + mudanza inmediata + perfil excelente. Esta combinación crea una propuesta irresistible de alto valor total.',
        },
      ],
      [
        { type: ContentType.H3, text: 'Estrategia 10: Solicitud de "Mejor Oferta"' },
        {
          type: ContentType.P,
          text: 'Deja que ellos hagan la primera concesión. Pregunta: "¿Hay alguna flexibilidad en el precio? ¿Cuál sería su mejor oferta?" Luego SILENCIO. Deja que ellos hablen primero. Muchas veces revelarán que hay margen.',
        },
      ],
      // Qué Decir y Qué NO Decir
      [
        { type: ContentType.H2, text: 'Qué Decir y Qué NO Decir' },
        { type: ContentType.H3, text: 'Frases Efectivas' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Me encanta la propiedad, pero mi presupuesto es...' },
            {
              type: ContentType.LI,
              text: 'He visto propiedades similares por menos, ¿hay flexibilidad?',
            },
            { type: ContentType.LI, text: '¿Qué incluye exactamente ese precio?' },
            { type: ContentType.LI, text: 'Si me comprometo a [X], ¿podríamos hablar del precio?' },
            { type: ContentType.LI, text: '¿Cuál sería su mejor oferta?' },
            {
              type: ContentType.LI,
              text: 'Soy un inquilino de bajo riesgo, ¿consideran tarifas preferenciales?',
            },
          ],
        },
        { type: ContentType.H3, text: 'Frases Que Debes Evitar' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Pagaré lo que sea (perdiste toda negociación)' },
            { type: ContentType.LI, text: 'No tengo otras opciones (no tienes poder)' },
            { type: ContentType.LI, text: 'Esta es mi propiedad soñada (desesperación)' },
            { type: ContentType.LI, text: 'Puedo pagar más si... (nunca ofrezcas más)' },
            { type: ContentType.LI, text: 'Mi presupuesto máximo es... (nunca reveles tu tope)' },
          ],
        },
        { type: ContentType.H3, text: 'Tono y Actitud' },
        {
          type: ContentType.P,
          text: 'Correcto: Profesional y respetuoso, basado en datos, solución ganar-ganar, confiado pero no arrogante, amigable pero firme.',
        },
        {
          type: ContentType.P,
          text: 'Incorrecto: Agresivo, despectivo, demasiado emocional, suplicante, deshonesto.',
        },
      ],
      // Manejo de Objeciones
      [
        { type: ContentType.H2, text: 'Manejo de Objeciones' },
        {
          type: ContentType.P,
          text: '"El precio no es negociable": Respuesta: Entiendo, pero he notado que la propiedad lleva X tiempo disponible, y propiedades similares se alquilan por menos. ¿Están seguros que no hay flexibilidad? Alternativamente, ¿qué tal si incluyen [servicio/mejora]?',
        },
        {
          type: ContentType.P,
          text: '"Ya bajamos el precio anteriormente": Respuesta: Aprecio eso, muestra flexibilidad. ¿Hay posibilidad de un ajuste adicional pequeño, quizás 5%?',
        },
        {
          type: ContentType.P,
          text: '"Tenemos otros interesados": Respuesta: Entiendo, pero estoy aquí ahora, listo para comprometerme. Un inquilino seguro hoy vale más que potenciales mañana.',
        },
        {
          type: ContentType.P,
          text: '"La propiedad lo vale": Respuesta: No dudo que es buena propiedad. Mi pregunta es sobre el valor relativo al mercado actual. Basándome en comparables, el precio está X% arriba del promedio.',
        },
      ],
      // Negociación en Renovación
      [
        { type: ContentType.H2, text: 'Negociación en Renovación' },
        {
          type: ContentType.P,
          text: 'No olvides que también puedes negociar al renovar. Como inquilino actual tienes poder: has sido responsable, has cuidado la propiedad, el propietario evita costos de buscar nuevo inquilino.',
        },
        {
          type: ContentType.P,
          text: 'Costos que el propietario evita: 1-2 meses de vacante, publicidad, tiempo de inspecciones, limpieza, riesgo de inquilino desconocido. Total: $2,000-5,000.',
        },
      ],
      // Documentación
      [
        { type: ContentType.H2, text: 'Documentación de Acuerdos' },
        {
          type: ContentType.P,
          text: 'CRÍTICO: TODO por escrito. Documenta acuerdo de precio, inclusiones extras, condiciones especiales.',
        },
        {
          type: ContentType.P,
          text: 'Envía email de confirmación detallando: propiedad, términos financieros, inclusiones, reparaciones, pago inicial. Solicita confirmación por escrito.',
        },
        {
          type: ContentType.P,
          text: 'Por qué es esencial: Evita malentendidos, protección legal, claridad para ambas partes, base para el contrato formal.',
        },
      ],
      // Cuándo Aceptar y Retirarte
      [
        { type: ContentType.H2, text: 'Cuándo Aceptar y Cuándo Retirarte' },
        { type: ContentType.H3, text: 'Acepta cuando' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Has conseguido alguna concesión significativa' },
            { type: ContentType.LI, text: 'El precio final está dentro de tu presupuesto' },
            { type: ContentType.LI, text: 'Los términos son justos y están por escrito' },
            { type: ContentType.LI, text: 'La propiedad cumple tus necesidades' },
            { type: ContentType.LI, text: 'El propietario ha sido razonable y profesional' },
            { type: ContentType.LI, text: 'Has investigado y es buen valor' },
          ],
        },
        { type: ContentType.H3, text: 'Retírate cuando' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'El propietario es completamente inflexible y el precio es excesivo',
            },
            { type: ContentType.LI, text: 'Se niega a poner acuerdos por escrito' },
            { type: ContentType.LI, text: 'Muestra múltiples red flags de comportamiento' },
            { type: ContentType.LI, text: 'El trato parece demasiado bueno (posible estafa)' },
            { type: ContentType.LI, text: 'Tienes mejor opción en otro lugar' },
            { type: ContentType.LI, text: 'Tu intuición dice que algo está mal' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Recuerda: Caminar hacia otro lado es poder. Si no estás dispuesto a irte, no tienes poder de negociación.',
        },
      ],
      // Cálculo del Impacto
      [
        { type: ContentType.H2, text: 'Cálculo del Impacto Financiero' },
        {
          type: ContentType.P,
          text: 'Ejemplo real: Precio pedido $1,300/mes → Precio negociado $1,175/mes → Ahorro mensual $125.',
        },
        {
          type: ContentType.P,
          text: 'Impacto financiero: Ahorro en 1 año: $1,500. Ahorro en 2 años: $3,000. Plus internet incluido ($50/mes): $600/año adicionales. Total ahorrado en 2 años: $4,200.',
        },
        {
          type: ContentType.P,
          text: 'Tiempo invertido en negociar: 2-3 horas. Retorno por hora: $1,400.',
        },
      ],
      // Errores Comunes
      [
        { type: ContentType.H2, text: 'Errores Comunes a Evitar' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Error 1: No intentar negociar → Pagas de más garantizado',
            },
            {
              type: ContentType.LI,
              text: 'Error 2: Aceptar primera contraoferta → Dejas dinero en la mesa',
            },
            {
              type: ContentType.LI,
              text: 'Error 3: Revelar tu máximo presupuesto → El propietario no bajará de ese número',
            },
            {
              type: ContentType.LI,
              text: 'Error 4: Negociar sin investigar mercado → No tienes argumentos sólidos',
            },
            {
              type: ContentType.LI,
              text: 'Error 5: Confiar en promesas verbales → Sin escritura, no tiene validez legal',
            },
            {
              type: ContentType.LI,
              text: 'Error 6: Ser agresivo o grosero → El propietario se cierra',
            },
            { type: ContentType.LI, text: 'Error 7: Mostrar desesperación → Pierdes todo poder' },
            {
              type: ContentType.LI,
              text: 'Error 8: No tener plan B → No puedes caminar, ellos lo saben',
            },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Negociar el precio de alquiler no solo es aceptable, es esperado en el mercado inmobiliario. Los propietarios inteligentes respetan a inquilinos que negocian profesionalmente porque demuestra inteligencia financiera y que serán inquilinos responsables.',
        },
        { type: ContentType.P, text: 'Principios clave:' },
        {
          type: ContentType.OL,
          children: [
            { type: ContentType.LI, text: 'Siempre negocia: El peor caso es que digan no' },
            { type: ContentType.LI, text: 'Investiga primero: Datos = poder' },
            { type: ContentType.LI, text: 'Sé profesional: Respeto genera respeto' },
            { type: ContentType.LI, text: 'Usa múltiples estrategias: Combina tácticas' },
            { type: ContentType.LI, text: 'Todo por escrito: Protégete legalmente' },
            { type: ContentType.LI, text: 'Está dispuesto a caminar: Tu mejor poder' },
            { type: ContentType.LI, text: 'Piensa largo plazo: El ahorro se multiplica' },
            { type: ContentType.LI, text: 'Busca ganar-ganar: Colaboración > confrontación' },
          ],
        },
        {
          type: ContentType.P,
          text: 'El dinero que no negocies hoy es dinero que pierdes cada mes del contrato. Una conversación de 30 minutos puede ahorrarte miles de dólares.',
        },
        {
          type: ContentType.P,
          text: 'No tengas miedo de negociar. Los propietarios que se ofenden por negociación profesional probablemente no sean buenos propietarios de todos modos. Encuentra alguien que valore tener un buen inquilino y esté dispuesto a trabajar contigo para llegar a términos justos para ambos.',
        },
      ],
    ],
  },
  {
    id: 9,
    title: 'Lee el contrato cuidadosamente',
    excerpt:
      'Entiende todos los términos, cláusulas de finalización, quién paga servicios, y qué se considera daño normal vs. daño que debes pagar.',
    category: ArticleType.LEGAL,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Firmar un contrato de alquiler sin leerlo completamente es como jugar a la ruleta rusa con tu dinero y derechos. Muchos inquilinos se arrepienten amargamente de no haber prestado atención a cláusulas que parecían "letra pequeña" pero que resultaron ser extremadamente costosas o restrictivas. Un contrato de alquiler es un documento legal vinculante que puede afectar tu vida durante meses o años. Esta guía te enseñará exactamente qué buscar, qué cuestionar, y cómo protegerte antes de firmar.',
        },
      ],
      // Por Qué Es Crítico
      [
        { type: ContentType.H2, text: 'Por Qué Es Crítico Leer CADA Palabra' },
        { type: ContentType.H3, text: 'Consecuencias de no leer el contrato' },
        {
          type: ContentType.P,
          text: 'Financieras: Cláusulas de penalización por terminación anticipada ($1,000-3,000), responsabilidades de pago no esperadas, pérdida de depósito por violaciones desconocidas, aumentos automáticos, cargos ocultos.',
        },
        {
          type: ContentType.P,
          text: 'Legales: Obligaciones que no sabías que aceptaste, renuncia a derechos, cláusulas de arbitraje que eliminan tu derecho a demandar, responsabilidad por daños que no causaste.',
        },
        {
          type: ContentType.P,
          text: 'Calidad de vida: Restricciones que afectan tu estilo de vida (mascotas, visitas, modificaciones), imposibilidad de salir del contrato, problemas con propietarios.',
        },
        {
          type: ContentType.P,
          text: 'Historia real: "Firmé sin leer. No sabía que si rompía el contrato debía pagar el alquiler restante de TODO el año ($12,000). Cuando me ofrecieron un trabajo en otra ciudad, quedé atrapado."',
        },
      ],
      // Preparación
      [
        { type: ContentType.H2, text: 'Antes de Leer: Preparación' },
        {
          type: ContentType.P,
          text: 'Tiempo suficiente: No leas con prisa, mínimo 1-2 horas, rechaza presión de "firma ahora".',
        },
        {
          type: ContentType.P,
          text: 'Ambiente adecuado: Lugar tranquilo sin distracciones, buena iluminación, toma notas mientras lees.',
        },
        {
          type: ContentType.P,
          text: 'Herramientas: Resaltador para marcar cláusulas importantes, bolígrafo para notas, esta guía como referencia, diccionario legal si hay términos confusos.',
        },
        {
          type: ContentType.P,
          text: 'Apoyo: Considera llevar a alguien de confianza, abogado si el contrato es complejo, no tengas vergüenza de pedir aclaraciones.',
        },
      ],
      // Estructura del Contrato
      [
        { type: ContentType.H2, text: 'Estructura Típica de un Contrato de Alquiler' },
        {
          type: ContentType.OL,
          children: [
            { type: ContentType.LI, text: 'Información de las partes (Propietario e Inquilino)' },
            { type: ContentType.LI, text: 'Descripción de la propiedad' },
            {
              type: ContentType.LI,
              text: 'Términos del arrendamiento (duración, renta, depósito)',
            },
            { type: ContentType.LI, text: 'Obligaciones del propietario' },
            { type: ContentType.LI, text: 'Obligaciones del inquilino' },
            { type: ContentType.LI, text: 'Servicios y gastos' },
            { type: ContentType.LI, text: 'Mantenimiento y reparaciones' },
            { type: ContentType.LI, text: 'Modificaciones y mejoras' },
            { type: ContentType.LI, text: 'Uso de la propiedad y restricciones' },
            { type: ContentType.LI, text: 'Terminación del contrato' },
            { type: ContentType.LI, text: 'Penalizaciones y multas' },
            { type: ContentType.LI, text: 'Resolución de disputas' },
            { type: ContentType.LI, text: 'Cláusulas adicionales' },
            { type: ContentType.LI, text: 'Firmas' },
          ],
        },
      ],
      // Sección 1
      [
        { type: ContentType.H2, text: 'Sección 1: Identificación de las Partes' },
        {
          type: ContentType.P,
          text: 'Información del propietario: Nombre legal completo, dirección de contacto, teléfono y email, ¿es el dueño o un administrador?',
        },
        {
          type: ContentType.P,
          text: 'CRÍTICO: Verifica que quien firma es realmente el dueño o tiene autorización legal. Pide ver título de propiedad, autorización escrita si es administrador, identificación oficial.',
        },
        {
          type: ContentType.P,
          text: 'Red flag: Alguien que se niega a probar que es el propietario legítimo puede ser un estafador.',
        },
        {
          type: ContentType.P,
          text: 'Tu información: Verifica que tu nombre esté correcto, dirección actual, contactos de emergencia.',
        },
        {
          type: ContentType.P,
          text: 'Co-inquilinos: Si vives con roommates, ¿están todos en el contrato? ¿Son solidariamente responsables? (esto significa que cada uno responde por la totalidad). Si dos roommates no pagan, el propietario puede demandarte a ti por todo.',
        },
      ],
      // Sección 2
      [
        { type: ContentType.H2, text: 'Sección 2: Descripción de la Propiedad' },
        {
          type: ContentType.P,
          text: 'Dirección completa: Calle, número, piso, departamento, código postal, identificación única.',
        },
        {
          type: ContentType.P,
          text: 'Descripción detallada: Cantidad de habitaciones, baños, metros cuadrados, áreas incluidas (balcón, terraza, sótano).',
        },
        {
          type: ContentType.P,
          text: 'Estacionamiento: Número de espacio asignado, ¿incluido o adicional?, ubicación (cubierto, descubierto).',
        },
        {
          type: ContentType.P,
          text: 'Amenidades: ¿Qué puedes usar? (gimnasio, piscina, sala común), ¿hay costos adicionales?, horarios de uso.',
        },
        {
          type: ContentType.P,
          text: 'Inventario (si viene amueblado): Lista detallada de muebles y electrodomésticos, estado de cada ítem, fotos anexas.',
        },
        {
          type: ContentType.P,
          text: 'Qué hacer: Compara esta descripción con la realidad. Si algo no coincide, pide corrección ANTES de firmar.',
        },
      ],
      // Sección 3
      [
        { type: ContentType.H2, text: 'Sección 3: Términos Financieros (LA MÁS IMPORTANTE)' },
        { type: ContentType.H3, text: 'Renta Mensual' },
        {
          type: ContentType.P,
          text: 'Monto exacto: ¿Cuánto pagas mensualmente? ¿En qué moneda? ¿Hay ajustes por inflación?',
        },
        {
          type: ContentType.P,
          text: 'Fecha de vencimiento: Día específico del mes, ¿hay período de gracia?, forma de pago aceptada.',
        },
        {
          type: ContentType.P,
          text: 'Lugar/método de pago: Transferencia bancaria (datos completos), efectivo con recibo, cheque, plataforma online. EXIGE siempre recibos por cada pago.',
        },
        {
          type: ContentType.P,
          text: 'Cargos por mora: ¿Cuánto cobran si pagas tarde? ¿Desde qué día? ¿Porcentaje o monto fijo? Típico: 3-5% de la renta o $50-100 fijos. Red flag: Cargos excesivos (más de 10%).',
        },
        { type: ContentType.H3, text: 'Depósito de Garantía' },
        {
          type: ContentType.P,
          text: 'Monto: Típicamente 1-2 meses de renta, ¿es reembolsable? (debe serlo), ¿genera intereses? (en algunos lugares es requisito legal).',
        },
        {
          type: ContentType.P,
          text: 'Condiciones de devolución: ¿Cuándo se devuelve? (generalmente 15-30 días post mudanza), ¿qué puede descontarse?, ¿proceso de inspección final?, ¿debe ser por escrito el detalle de deducciones?',
        },
      ],
      // Sección 4
      [
        { type: ContentType.H2, text: 'Sección 4: Duración del Contrato y Terminación' },
        { type: ContentType.H3, text: 'Duración' },
        {
          type: ContentType.P,
          text: 'Fecha de inicio y fin exactas. Tipo de contrato: plazo fijo (6 meses, 1 año, 2 años) o mes a mes. Renovación: ¿automática o requiere nuevo acuerdo? ¿bajo qué términos?',
        },
        { type: ContentType.H3, text: 'Terminación Anticipada' },
        {
          type: ContentType.P,
          text: 'CRÍTICO: Esta es una de las cláusulas más importantes. Debes saber exactamente qué pasa si necesitas salir antes.',
        },
        {
          type: ContentType.P,
          text: '¿Puedes terminar antes del plazo? ¿Cuánto aviso debes dar? (típico: 30-60 días). ¿Hay penalización? ¿Cuánto? ¿Pierdes el depósito? ¿Debes pagar rentas restantes?',
        },
        {
          type: ContentType.P,
          text: 'Terminación por el propietario: ¿Bajo qué causas puede terminar? ¿Cuánto aviso debe darte? ¿Qué pasa si vende la propiedad? ¿Tu contrato continúa con nuevo dueño?',
        },
      ],
      // Sección 5
      [
        { type: ContentType.H2, text: 'Sección 5: Obligaciones del Propietario' },
        {
          type: ContentType.P,
          text: 'Mantenimiento estructural: Techo, paredes, cimientos, sistemas eléctricos y plomería, calefacción y aire acondicionado, elevadores en edificios.',
        },
        {
          type: ContentType.P,
          text: 'Reparaciones mayores: Electrodomésticos incluidos que se rompan, problemas de plomería o electricidad, filtraciones y humedades, plagas (generalmente).',
        },
        {
          type: ContentType.P,
          text: 'Seguridad: Cerraduras funcionales, luces en áreas comunes, sistemas de seguridad del edificio.',
        },
        {
          type: ContentType.P,
          text: 'Habitabilidad: Agua corriente, electricidad, calefacción/enfriamiento funcional, libre de plagas y moho.',
        },
        {
          type: ContentType.P,
          text: 'Privacidad: No puede entrar sin aviso (excepto emergencias), debe dar aviso de 24-48 horas para inspecciones.',
        },
        {
          type: ContentType.P,
          text: 'Red flag: Contrato que hace responsable al inquilino de reparaciones que legalmente corresponden al propietario.',
        },
        {
          type: ContentType.P,
          text: 'Tiempo de respuesta: Emergencias (fuga de gas, sin agua, sin calefacción, fuga de agua mayor, falla eléctrica). Reparaciones no urgentes (típico: 7-14 días). Tu derecho: En muchas jurisdicciones, si el propietario no hace reparaciones críticas, puedes hacerlas tú y deducir de la renta, retener renta, o terminar el contrato sin penalización.',
        },
      ],
      // Sección 6
      [
        { type: ContentType.H2, text: 'Sección 6: Obligaciones del Inquilino' },
        { type: ContentType.P, text: 'Pagar renta a tiempo: Tu obligación principal.' },
        {
          type: ContentType.P,
          text: 'Mantenimiento básico: Limpieza regular, cambiar bombillas, filtros de aire acondicionado, reportar problemas oportunamente.',
        },
        {
          type: ContentType.P,
          text: 'Uso apropiado: No dañar intencionalmente, usar electrodomésticos correctamente, mantener áreas bien ventiladas.',
        },
        {
          type: ContentType.P,
          text: 'Permitir acceso: Para reparaciones (con aviso apropiado), inspecciones periódicas (razonables), mostrar propiedad a futuros inquilinos (cerca del fin del contrato).',
        },
        {
          type: ContentType.P,
          text: 'No hacer modificaciones sin permiso: Pintar, instalar cosas permanentes, cambios estructurales.',
        },
        {
          type: ContentType.P,
          text: 'Qué puedes hacer sin permiso (generalmente): Colgar cuadros con clavos pequeños, muebles removibles, decoración temporal.',
        },
        {
          type: ContentType.P,
          text: 'Seguir reglas del edificio: Horarios de silencio, uso de amenidades, políticas de mascotas, estacionamiento.',
        },
      ],
      // Sección 7
      [
        { type: ContentType.H2, text: 'Sección 7: Restricciones y Políticas' },
        { type: ContentType.H3, text: 'Mascotas' },
        {
          type: ContentType.P,
          text: 'Política clara: ¿Permitidas o no? ¿Qué tipo? (perros, gatos, pájaros). ¿Límite de tamaño o peso? ¿Límite de cantidad?',
        },
        {
          type: ContentType.P,
          text: 'Costos adicionales: Depósito extra por mascota (¿reembolsable?), renta adicional mensual ("pet rent"), límite de responsabilidad por daños.',
        },
        {
          type: ContentType.P,
          text: 'Si tienes mascota, negócialo ANTES de firmar. Ocultarla es violación grave del contrato.',
        },
        { type: ContentType.H3, text: 'Subarrendamiento' },
        {
          type: ContentType.P,
          text: '¿Puedes subarrendar? ¿Totalmente prohibido? ¿Permitido con aprobación? ¿Cuál es el proceso? Por qué importa: Si te mudas temporalmente o necesitas compartir gastos.',
        },
        { type: ContentType.H3, text: 'Número de ocupantes' },
        {
          type: ContentType.P,
          text: 'Límite de personas: ¿Cuántas pueden vivir? ¿Límite para visitas prolongadas? Típico: 2 personas por habitación + 1. Red flag: Límites extremadamente restrictivos.',
        },
        { type: ContentType.H3, text: 'Uso de la propiedad' },
        {
          type: ContentType.P,
          text: 'Residencial vs. comercial: ¿Puedes trabajar desde casa? ¿Recibir clientes? ¿Vender productos online?',
        },
        {
          type: ContentType.P,
          text: 'Actividades prohibidas: Fumar (dentro, fuera, balcón), fiestas o reuniones grandes, actividades ilegales, actividades ruidosas en horarios específicos.',
        },
        { type: ContentType.H3, text: 'Estacionamiento' },
        {
          type: ContentType.P,
          text: 'Detalles específicos: Número de espacio asignado, ¿puede cambiar?, ¿vehículo adicional?, política para visitas.',
        },
      ],
      // Sección 8
      [
        { type: ContentType.H2, text: 'Sección 8: Cláusulas Problemáticas a Observar' },
        { type: ContentType.H3, text: 'RED FLAGS - Cláusulas potencialmente abusivas' },
        {
          type: ContentType.P,
          text: 'Entrada sin aviso: "El propietario puede entrar en cualquier momento sin previo aviso" - ILEGAL en la mayoría de jurisdicciones. Tu privacidad está protegida por ley.',
        },
        {
          type: ContentType.P,
          text: 'Renuncia a derechos legales: "El inquilino renuncia a todos los derechos otorgados por la ley" - INVÁLIDO, no puedes renunciar a derechos que la ley te da.',
        },
        {
          type: ContentType.P,
          text: 'Responsabilidad ilimitada: Te hace responsable incluso de desastres naturales.',
        },
        {
          type: ContentType.P,
          text: 'Retención total del depósito: "El depósito no será devuelto bajo ninguna circunstancia" - ILEGAL, el depósito es reembolsable si no hay daños.',
        },
        {
          type: ContentType.P,
          text: 'Aumentos arbitrarios: "El propietario puede aumentar la renta en cualquier momento y por cualquier monto" - Generalmente limitado por ley.',
        },
        {
          type: ContentType.P,
          text: 'Desalojo sin causa: Durante contrato vigente esto es generalmente ilegal.',
        },
        {
          type: ContentType.P,
          text: 'Penalizaciones excesivas: "Cualquier violación resultará en una multa de $5,000" - Penalizaciones deben ser razonables.',
        },
        {
          type: ContentType.P,
          text: 'Arbitraje obligatorio: Limita tu derecho a demandar. No necesariamente ilegal pero desventajoso.',
        },
        { type: ContentType.H3, text: 'Cláusulas que debes negociar o rechazar' },
        {
          type: ContentType.P,
          text: 'Renovación automática con aumento: Deberías poder negociar cada renovación.',
        },
        {
          type: ContentType.P,
          text: 'Restricciones extremas: "No se permiten visitas por más de 2 días consecutivos" - Interfiere con tu vida personal.',
        },
        {
          type: ContentType.P,
          text: 'Mantenimiento trasladado: El propietario debe mantener estructura y sistemas mayores.',
        },
        {
          type: ContentType.P,
          text: 'Costos ocultos: "Pueden aplicarse cargos adicionales según criterio del propietario" - Todos los costos deben estar especificados.',
        },
      ],
      // Sección 9
      [
        { type: ContentType.H2, text: 'Sección 9: Resolución de Disputas' },
        {
          type: ContentType.P,
          text: 'Métodos de resolución: Comunicación directa (primera instancia), mediación (tercero neutral ayuda a llegar a acuerdo, más rápido y barato), arbitraje (tercero toma decisión vinculante, puede ser obligatorio), tribunales (última instancia, ¿el contrato limita este derecho?).',
        },
        {
          type: ContentType.P,
          text: 'Importante: Verifica si el contrato te obliga a arbitraje y si renuncia a tribunales. Esto puede ser desventajoso.',
        },
      ],
      // Sección 10
      [
        { type: ContentType.H2, text: 'Sección 10: Anexos y Documentos Adicionales' },
        {
          type: ContentType.P,
          text: 'Qué debe estar anexo: Lista de inventario (si viene amueblado, estado de cada ítem con fotos), inspección inicial (estado de la propiedad al mudarte, fotos fechadas, firma de ambas partes), reglamento del edificio (si aplica, forma parte del contrato), acuerdos especiales (reparaciones prometidas, condiciones negociadas, precio especial o descuentos).',
        },
        {
          type: ContentType.P,
          text: 'CRÍTICO: Cualquier acuerdo verbal debe estar POR ESCRITO como anexo al contrato. Si no está escrito, no existe legalmente.',
        },
      ],
      // Preguntas Críticas
      [
        { type: ContentType.H2, text: 'Preguntas Críticas Antes de Firmar' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: '¿Puedo llevar el contrato para que lo revise un abogado? (Si se niega, es red flag enorme)',
            },
            {
              type: ContentType.LI,
              text: '¿Qué pasa exactamente si necesito salir antes del término?',
            },
            {
              type: ContentType.LI,
              text: '¿Quién es responsable de qué reparaciones específicamente?',
            },
            {
              type: ContentType.LI,
              text: '¿Ha habido aumento de renta en los últimos años? ¿Cuánto?',
            },
            {
              type: ContentType.LI,
              text: '¿Puedo hablar con el inquilino anterior sobre su experiencia?',
            },
            {
              type: ContentType.LI,
              text: '¿Bajo qué circunstancias específicas se retendría el depósito?',
            },
            { type: ContentType.LI, text: 'Esta cláusula [X] me confunde, ¿puede explicarla?' },
          ],
        },
      ],
      // Checklist Final
      [
        { type: ContentType.H2, text: 'Después de Leer: Antes de Firmar' },
        { type: ContentType.H3, text: 'Checklist final' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'He leído TODO el contrato, incluyendo la letra pequeña',
            },
            { type: ContentType.LI, text: 'Entiendo todas las cláusulas' },
            { type: ContentType.LI, text: 'No hay términos ambiguos sin aclarar' },
            { type: ContentType.LI, text: 'Todos los acuerdos verbales están por escrito' },
            {
              type: ContentType.LI,
              text: 'He verificado que los números (renta, depósito, etc.) son correctos',
            },
            { type: ContentType.LI, text: 'Revisé anexos y documentos adicionales' },
            { type: ContentType.LI, text: 'Las fechas de inicio/fin son correctas' },
            { type: ContentType.LI, text: 'Mi nombre está escrito correctamente' },
            { type: ContentType.LI, text: 'He documentado el estado inicial con fotos' },
            { type: ContentType.LI, text: 'He consultado con abogado si algo me preocupa' },
            { type: ContentType.LI, text: 'No hay red flags graves' },
            { type: ContentType.LI, text: 'Tengo tiempo para leerlo sin presión' },
            { type: ContentType.LI, text: 'Me siento cómodo firmando' },
          ],
        },
        {
          type: ContentType.P,
          text: 'Si algo no está claro: NO FIRMES hasta que todas tus preguntas estén respondidas, ambigüedades estén aclaradas por escrito, acuerdos verbales estén documentados, estés 100% seguro de lo que estás firmando.',
        },
        {
          type: ContentType.P,
          text: 'Es mejor perder una oportunidad que quedar atrapado en un contrato malo durante meses o años.',
        },
      ],
      // Negociación
      [
        { type: ContentType.H2, text: 'Negociación de Cláusulas' },
        {
          type: ContentType.P,
          text: 'Recuerda: Los contratos son negociables ANTES de firmar. Identifica cláusulas problemáticas, propón alternativas, pide agregar protecciones, solicita aclaraciones por escrito.',
        },
        {
          type: ContentType.P,
          text: 'Cambios comunes que puedes pedir: Reducir período de aviso para terminación, clarificar qué incluye la renta, agregar cláusula de terminación anticipada razonable, definir "desgaste normal" específicamente, especificar proceso de devolución de depósito, limitar aumentos futuros, aclarar responsabilidades de mantenimiento.',
        },
        {
          type: ContentType.P,
          text: 'Si se niegan a modificar cláusulas abusivas, considera si realmente quieres alquilar con este propietario.',
        },
      ],
      // Documentación Post-Firma
      [
        { type: ContentType.H2, text: 'Documentación Post-Firma' },
        {
          type: ContentType.P,
          text: 'Obtén copias: Contrato firmado por ambas partes, todos los anexos, recibos de pagos iniciales, inventario con fotos.',
        },
        {
          type: ContentType.P,
          text: 'Guarda todo: Carpeta física, backup digital en nube, copias adicionales en lugar seguro.',
        },
        {
          type: ContentType.P,
          text: 'Toma fotos el día de mudanza: Toda la propiedad, lecturas de medidores, estado de cada habitación, electrodomésticos funcionando. Estas fotos te protegerán al momento de recuperar tu depósito.',
        },
      ],
      // Qué Hacer Si Ya Firmaste
      [
        { type: ContentType.H2, text: 'Qué Hacer Si Ya Firmaste Sin Leer' },
        {
          type: ContentType.P,
          text: 'Si descubres cláusulas problemáticas después: Habla con el propietario (explica tu preocupación, pide modificar por acuerdo mutuo, muchos aceptarán cambios justos), consulta abogado (algunas cláusulas pueden ser ilegales y por tanto inválidas), verifica la ley local (muchas cláusulas abusivas son ilegales automáticamente, la ley supera el contrato), documenta todo desde ahora (comunicaciones por escrito, fotos del estado actual, pagos con recibos).',
        },
        {
          type: ContentType.P,
          text: 'Importante: Un contrato firmado es vinculante, pero cláusulas ilegales no son válidas incluso si las firmaste.',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Leer y entender completamente tu contrato de alquiler no es opcional - es esencial. Este documento gobierna uno de los aspectos más importantes de tu vida durante meses o años: tu hogar.',
        },
        { type: ContentType.P, text: 'Reglas de oro:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: 'Lee TODO: Cada palabra, cada cláusula, toda la letra pequeña',
            },
            {
              type: ContentType.LI,
              text: 'Entiende TODO: Si no entiendes algo, pregunta hasta que lo entiendas',
            },
            {
              type: ContentType.LI,
              text: 'Cuestiona lo que no tiene sentido: No tengas miedo de preguntar "¿Por qué?"',
            },
            {
              type: ContentType.LI,
              text: 'Negocia antes de firmar: Una vez firmado, es vinculante',
            },
            {
              type: ContentType.LI,
              text: 'Todo por escrito: Acuerdos verbales no valen legalmente',
            },
            {
              type: ContentType.LI,
              text: 'Consulta expertos: Si algo te preocupa, habla con abogado',
            },
            { type: ContentType.LI, text: 'Toma tu tiempo: Nunca firmes bajo presión' },
            { type: ContentType.LI, text: 'Documenta el estado inicial: Protege tu depósito' },
            { type: ContentType.LI, text: 'Guarda copias: De todo, para siempre' },
            {
              type: ContentType.LI,
              text: 'Confía en tu instinto: Si algo se siente mal, probablemente lo es',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Tu firma en ese contrato es tu palabra legal de que entendiste y aceptaste TODO lo que dice. No firmes nada que no hayas leído y entendido completamente.',
        },
        {
          type: ContentType.P,
          text: 'Un propietario profesional y honesto nunca tendrá problema con que leas cuidadosamente, hagas preguntas, o incluso consultes con un abogado antes de firmar. Si alguien te presiona para firmar rápido sin leer, esa es tu señal para alejarte.',
        },
        {
          type: ContentType.P,
          text: 'Recuerda: 2-3 horas invirtiendo en leer el contrato pueden ahorrarte miles de dólares y años de problemas legales.',
        },
      ],
    ],
  },
  {
    id: 10,
    title: 'Habla con vecinos',
    excerpt:
      'Pregunta a los vecinos sobre el propietario, la calidad del barrio, problemas comunes en el edificio y la confiabilidad del servicio de mantenimiento.',
    category: ArticleType.TIPS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Los vecinos son tu fuente de información más valiosa y honesta sobre una propiedad. A diferencia del propietario o agente inmobiliario (que tienen interés económico en que alquiles), los vecinos no tienen nada que ganar ocultándote la verdad. Pueden revelarte problemas que nunca descubrirías en una visita: desde propietarios problemáticos hasta problemas estructurales del edificio, desde situaciones de seguridad hasta la verdadera calidad de vida en esa ubicación.',
        },
      ],
      // Por Qué Es Esencial
      [
        { type: ContentType.H2, text: 'Por Qué Hablar con Vecinos es Esencial' },
        { type: ContentType.H3, text: 'Información que SOLO los vecinos pueden darte' },
        {
          type: ContentType.P,
          text: 'Sobre el propietario: ¿Realmente responde a problemas? ¿Cumple promesas? ¿Es razonable o conflictivo? ¿Ha tenido disputas? ¿Aumenta agresivamente la renta?',
        },
        {
          type: ContentType.P,
          text: 'Sobre el edificio/complejo: Problemas recurrentes (plomería, electricidad, plagas), calidad del mantenimiento, funcionamiento de amenidades, administración efectiva o incompetente, proyectos pendientes.',
        },
        {
          type: ContentType.P,
          text: 'Sobre el barrio: Seguridad real (experiencias vividas), ruido (tráfico, bares, construcción, vecinos), estacionamiento (¿realmente hay espacio?), problemas con servicios, cambios recientes.',
        },
        {
          type: ContentType.P,
          text: 'Sobre la vida diaria: Calidad del internet/servicios, disponibilidad de transporte, comercios y servicios cercanos, convivencia en el edificio, "personalidad" del barrio.',
        },
        { type: ContentType.H3, text: 'Historias reales que habrías evitado' },
        {
          type: ContentType.P,
          text: '"El propietario nunca respondía": El agente era súper amable, pero después de mudarme descubrí que el propietario tardaba semanas. El vecino me hubiera advertido. Tres meses sin agua caliente.',
        },
        {
          type: ContentType.P,
          text: '"El edificio tenía problemas graves": Hermoso departamento, pero el vecino me dijo después de firmar que había filtraciones constantes. Dos semanas después, mi techo goteaba.',
        },
        {
          type: ContentType.P,
          text: '"El barrio era peligroso": De día se veía bien. Los vecinos me hubieran dicho que de noche era otra historia. Tres robos en dos meses.',
        },
        {
          type: ContentType.P,
          text: '"Ruido insoportable": No sabía que el bar tenía música hasta las 4 AM. Los vecinos lo sabían. No dormí bien durante un año.',
        },
      ],
      // Cuándo y Cómo Abordar
      [
        { type: ContentType.H2, text: 'Cuándo y Cómo Abordar a los Vecinos' },
        { type: ContentType.H3, text: 'Momento ideal' },
        {
          type: ContentType.P,
          text: 'Durante tu visita a la propiedad: Aprovecha mientras estás ahí, es natural, puedes tocar puertas vecinas.',
        },
        {
          type: ContentType.P,
          text: 'En diferentes horarios: Primera visita (horario laboral día de semana), segunda visita (tarde/noche o fin de semana). Te da perspectiva de diferentes situaciones.',
        },
        {
          type: ContentType.P,
          text: 'En áreas comunes: Hall de entrada, ascensor, lavandería compartida, estacionamiento, áreas de recreación. Ventaja: encuentro casual, menos intrusivo.',
        },
        { type: ContentType.H3, text: 'Cómo iniciar la conversación' },
        {
          type: ContentType.P,
          text: 'Presentación amigable y honesta: "Hola, disculpa que te moleste. Estoy pensando en alquilar el departamento X y me preguntaba si podrías contarme cómo es vivir aquí. ¿Tienes un minutito?"',
        },
        {
          type: ContentType.P,
          text: 'Por qué funciona: Eres transparente, pides su tiempo respetuosamente, les das autoridad como "expertos", la mayoría quiere ayudar.',
        },
        { type: ContentType.H3, text: 'Lenguaje corporal y actitud' },
        {
          type: ContentType.P,
          text: 'Sé amigable y genuino: Sonríe, contacto visual, lenguaje corporal abierto.',
        },
        {
          type: ContentType.P,
          text: 'Respeta su tiempo: Si están apurados no insistas, pregunta si es buen momento, agradece cualquier información.',
        },
        {
          type: ContentType.P,
          text: 'Sé específico: Preguntas concretas obtienen respuestas útiles. "¿Cómo es vivir aquí?" es vago. "¿Qué tal responde el propietario?" es específico.',
        },
      ],
      // A Quién Preguntar
      [
        { type: ContentType.H2, text: 'A Quién Preguntar' },
        { type: ContentType.H3, text: 'Prioriza estos vecinos' },
        {
          type: ContentType.P,
          text: '1. Vecinos inmediatos: Puerta de al lado (compartirán paredes), arriba (escucharás sus pasos), abajo (escucharán los tuyos), al frente (conocen el pasillo). Qué saber: ruido entre unidades, convivencia, problemas compartidos.',
        },
        {
          type: ContentType.P,
          text: '2. Inquilinos de larga data: Han visto múltiples situaciones, conocen la historia del edificio, saben sobre el propietario. Cómo identificarlos: decoraciones personales, plantas en balcones, pregunta "¿Hace cuánto vives aquí?"',
        },
        {
          type: ContentType.P,
          text: '3. Representantes del edificio: Presidente de consorcio, miembros de comité, encargado/portero. Información valiosa: estado financiero, proyectos pendientes, problemas estructurales, deudas comunes.',
        },
        {
          type: ContentType.P,
          text: '4. Comerciantes locales: Tienda de la esquina, café cercano, lavandería. Perspectiva única: conocen el barrio profundamente, ven problemas de seguridad, saben de cambios recientes.',
        },
        { type: ContentType.H3, text: 'A quiénes evitar o tomar con cautela' },
        {
          type: ContentType.P,
          text: 'El vecino quejoso: Algunos se quejan de TODO. Busca balance con otras opiniones. Si VARIOS mencionan lo mismo, es real.',
        },
        {
          type: ContentType.P,
          text: 'Personas conectadas al propietario: Familiares que viven en el edificio, amigos del dueño. Pueden no ser objetivos.',
        },
      ],
      // Las 20 Preguntas Esenciales
      [
        { type: ContentType.H2, text: 'Las 20 Preguntas Esenciales' },
        { type: ContentType.H3, text: 'Sobre el Propietario' },
        {
          type: ContentType.P,
          text: '1. "¿Qué tal es el propietario/administración?" - Pregunta abierta para que hablen libremente.',
        },
        {
          type: ContentType.P,
          text: '2. "¿Responde rápido cuando hay problemas?" - Crítico: un propietario que no responde arruinará tu experiencia. Respuesta ideal: "Sí, en 24-48 horas." Red flag: "Jaja, buena suerte con eso."',
        },
        {
          type: ContentType.P,
          text: '3. "¿Han tenido problemas para que haga reparaciones?" - Específico sobre cumplimiento.',
        },
        {
          type: ContentType.P,
          text: '4. "¿Sube mucho la renta cada año?" - Planifica tu presupuesto futuro.',
        },
        {
          type: ContentType.P,
          text: '5. "¿Cómo es al devolver depósitos?" - Algunos retienen injustamente. Preocupante: "El anterior tuvo que demandar."',
        },
        {
          type: ContentType.P,
          text: '6. "¿Entra a las propiedades sin aviso?" - Tu privacidad es un derecho.',
        },
        { type: ContentType.H3, text: 'Sobre el Edificio/Propiedad' },
        {
          type: ContentType.P,
          text: '7. "¿Qué problemas comunes hay en el edificio?" - Plomería, electricidad, estructura, plagas. Escucha: filtraciones recurrentes, cortes de luz, plagas, problemas de calefacción.',
        },
        {
          type: ContentType.P,
          text: '8. "¿Funciona bien el mantenimiento?" (ascensor, áreas comunes).',
        },
        {
          type: ContentType.P,
          text: '9. "¿Ha habido proyectos grandes de reparación?" - Señal de mantenimiento proactivo o problemas graves.',
        },
        {
          type: ContentType.P,
          text: '10. "¿Hay problemas con servicios?" (agua, luz, gas, internet) - Cortes frecuentes, baja presión, internet lento.',
        },
        {
          type: ContentType.P,
          text: '11. "¿Qué tal las amenidades?" - ¿Realmente funcionan o están siempre "en mantenimiento"?',
        },
        {
          type: ContentType.P,
          text: '12. "¿Hay cámaras de seguridad y funcionan?" - Algunas son solo decorativas.',
        },
        { type: ContentType.H3, text: 'Sobre Seguridad' },
        {
          type: ContentType.P,
          text: '13. "¿Qué tan seguro es el barrio/edificio?" - Pregunta abierta.',
        },
        {
          type: ContentType.P,
          text: '14. "¿Han tenido problemas de robos o inseguridad?" - Específico y directo. Profundiza: ¿dónde?, ¿qué tan frecuente?, ¿han mejorado?, ¿a qué horas?',
        },
        {
          type: ContentType.P,
          text: '15. "¿Es seguro estacionarse en la calle/estacionamiento?" - Robos, vandalismo, disponibilidad real.',
        },
        { type: ContentType.H3, text: 'Sobre Ruido y Calidad de Vida' },
        {
          type: ContentType.P,
          text: '16. "¿Qué tan ruidoso es por aquí?" - De día vs. noche, entre semana vs. fines de semana. Tipos: tráfico, vecinos, bares, construcción, aeropuertos/trenes.',
        },
        {
          type: ContentType.P,
          text: '17. "¿Se escucha mucho entre unidades?" - Aislamiento acústico, paredes delgadas, pisos que crujen.',
        },
        {
          type: ContentType.P,
          text: '18. "¿Hay vecinos problemáticos?" - Ruidosos, conflictivos, situaciones incómodas.',
        },
        { type: ContentType.H3, text: 'Sobre el Barrio' },
        {
          type: ContentType.P,
          text: '19. "¿Qué tal está la ubicación?" - Transporte público, comercios, servicios, bancos, farmacias, supermercados.',
        },
        {
          type: ContentType.P,
          text: '20. "¿Han notado cambios en el barrio últimamente?" - Mejoras (gentrificación, nuevos servicios) o deterioro (comercios cerrando, más inseguridad).',
        },
      ],
      // Cómo Interpretar Respuestas
      [
        { type: ContentType.H2, text: 'Cómo Interpretar las Respuestas' },
        { type: ContentType.H3, text: 'Señales positivas (luz verde)' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Respuestas específicas y detalladas: "El propietario arregló mi lavavajillas en dos días"',
            },
            {
              type: ContentType.LI,
              text: 'Comentarios genuinamente positivos: "Vivo aquí hace 5 años, estoy muy contento"',
            },
            {
              type: ContentType.LI,
              text: 'Vecinos contentos que recomiendan: "Es buen lugar, te va a gustar"',
            },
            {
              type: ContentType.LI,
              text: 'Problemas menores y aislados: "A veces el ascensor tarda, pero nada grave"',
            },
            {
              type: ContentType.LI,
              text: 'Propietario responsivo: "Cualquier cosa que reportamos, la atiende rápido"',
            },
          ],
        },
        { type: ContentType.H3, text: 'Señales de alerta (luz amarilla)' },
        {
          type: ContentType.UL,
          children: [
            { type: ContentType.LI, text: 'Respuestas vagas o evasivas: "Mmm, es... ok, supongo"' },
            {
              type: ContentType.LI,
              text: 'Vacilación antes de responder: indica que están pensando cómo decirte algo negativo',
            },
            {
              type: ContentType.LI,
              text: 'Problema mencionado por múltiples vecinos: si 2-3 personas mencionan lo mismo, es real',
            },
            {
              type: ContentType.LI,
              text: '"Depende de ti": puede estar tratando de no desanimarte pero sin mentirte',
            },
            {
              type: ContentType.LI,
              text: 'Cambio de tema: preguntaste algo específico y cambiaron el tema',
            },
          ],
        },
        { type: ContentType.H3, text: 'Señales graves (luz roja)' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Advertencias directas: "Yo no lo alquilaría" / "Busca en otro lugar" / "Hay mejores opciones"',
            },
            {
              type: ContentType.LI,
              text: 'Problemas serios confirmados: "Hay ratas desde hace meses" / "Robaron tres autos este mes"',
            },
            {
              type: ContentType.LI,
              text: 'Propietario problemático: "Buena suerte logrando que arregle algo" / "El anterior se fue por problemas"',
            },
            {
              type: ContentType.LI,
              text: 'Múltiples inquilinos se han ido: "Nadie dura mucho aquí" / "Van tres inquilinos este año"',
            },
            {
              type: ContentType.LI,
              text: 'Lenguaje corporal negativo: muecas al mencionar al propietario, risa sarcástica, ojos rodando',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'REGLA DE ORO: Si tu instinto te dice que algo anda mal, probablemente tiene razón.',
        },
      ],
      // Preguntas Específicas
      [
        { type: ContentType.H2, text: 'Preguntas Específicas Según Tu Situación' },
        {
          type: ContentType.P,
          text: 'Si tienes mascotas: ¿Hay otros vecinos con mascotas? ¿Áreas para pasear? ¿Es amigable el edificio? ¿Han tenido problemas con animales?',
        },
        {
          type: ContentType.P,
          text: 'Si trabajas desde casa: ¿Qué tal es el internet? ¿Es ruidoso durante el día? ¿Hay espacios de coworking cerca?',
        },
        {
          type: ContentType.P,
          text: 'Si tienes auto: ¿Realmente hay espacio? ¿Es seguro dejarlo? ¿Problemas con espacios ocupados?',
        },
        {
          type: ContentType.P,
          text: 'Si tienes niños: ¿Hay otros niños? ¿Es seguro para jugar? ¿Qué tal las escuelas? ¿Hay parques?',
        },
        {
          type: ContentType.P,
          text: 'Si estudias/trabajas de noche: ¿Qué tan ruidoso es de noche? ¿Hay fiestas frecuentes? ¿Hay bares o vida nocturna cerca?',
        },
        {
          type: ContentType.P,
          text: 'Si usas transporte público: ¿Qué tal el servicio? ¿Es puntual y confiable? ¿Es segura la parada/estación?',
        },
      ],
      // Qué Hacer Con La Información
      [
        { type: ContentType.H2, text: 'Qué Hacer Con La Información Que Recopilas' },
        { type: ContentType.H3, text: 'Analiza patrones' },
        {
          type: ContentType.P,
          text: 'Una opinión negativa: puede ser personal. Dos opiniones negativas: presta atención. Tres o más opiniones negativas sobre lo mismo: RED FLAG enorme.',
        },
        { type: ContentType.H3, text: 'Pondera la fuente' },
        {
          type: ContentType.P,
          text: 'Inquilinos de largo plazo tienen más credibilidad, múltiples fuentes independientes confirman patrones, comerciantes locales tienen perspectiva histórica.',
        },
        { type: ContentType.H3, text: 'Compara con tu visita personal' },
        {
          type: ContentType.P,
          text: '¿Lo que dicen los vecinos coincide con lo que viste? ¿El propietario ocultó algo que los vecinos revelaron? ¿Hay discrepancias entre lo prometido y la realidad?',
        },
        { type: ContentType.H3, text: 'Usa la información para negociar' },
        {
          type: ContentType.P,
          text: 'Si hay problemas conocidos: "Los vecinos mencionaron que [problema]. ¿Está siendo atendido? ¿Podríamos ajustar el precio considerando esto?"',
        },
        { type: ContentType.H3, text: 'Documenta los testimonios' },
        {
          type: ContentType.P,
          text: 'Toma notas después de cada conversación: nombre del vecino (o descripción), fecha y hora, qué dijeron específicamente, tu impresión general. Esto te ayuda a recordar y comparar.',
        },
        { type: ContentType.H3, text: 'Confía en tu instinto' },
        {
          type: ContentType.P,
          text: 'Si múltiples vecinos te dan malas vibras sobre un lugar, no lo ignores. No importa cuán linda sea la propiedad, tu calidad de vida será miserable.',
        },
      ],
      // Errores Comunes
      [
        { type: ContentType.H2, text: 'Errores Comunes al Hablar con Vecinos' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Error 1: No hacerlo - El error más grande es saltarse este paso',
            },
            {
              type: ContentType.LI,
              text: 'Error 2: Hablar con una sola persona - Necesitas múltiples perspectivas',
            },
            {
              type: ContentType.LI,
              text: 'Error 3: Ignorar las advertencias - "Seguro exagera" = Meses de arrepentimiento',
            },
            {
              type: ContentType.LI,
              text: 'Error 4: Ser demasiado tímido - Mejor preguntar y quedar como curioso que no preguntar y vivir en el infierno',
            },
            {
              type: ContentType.LI,
              text: 'Error 5: Solo hablar en un horario - Visita en diferentes momentos del día',
            },
            {
              type: ContentType.LI,
              text: 'Error 6: No ser específico - Preguntas vagas dan respuestas vagas',
            },
            {
              type: ContentType.LI,
              text: 'Error 7: Revelar tu entusiasmo - Si ven que ya te decidiste, pueden no ser honestos',
            },
            {
              type: ContentType.LI,
              text: 'Error 8: No agradecer - Los vecinos hacen un favor, sé cortés',
            },
          ],
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Hablar con vecinos es la investigación más valiosa, fácil y gratuita que puedes hacer antes de alquilar. Te da información que NINGUNA otra fuente puede proporcionarte: la verdad sin filtros sobre cómo es realmente vivir ahí.',
        },
        { type: ContentType.P, text: 'Principios clave:' },
        {
          type: ContentType.OL,
          children: [
            { type: ContentType.LI, text: 'Siempre habla con vecinos antes de firmar' },
            {
              type: ContentType.LI,
              text: 'Habla con múltiples personas para obtener perspectiva balanceada',
            },
            { type: ContentType.LI, text: 'Haz preguntas específicas, no generales' },
            {
              type: ContentType.LI,
              text: 'Presta atención a patrones (múltiples personas mencionando lo mismo)',
            },
            {
              type: ContentType.LI,
              text: 'Compara con otras fuentes (propietario, reseñas online, visitas múltiples)',
            },
            {
              type: ContentType.LI,
              text: 'Confía en tu instinto - Si muchos vecinos mencionan problemas, créeles',
            },
            {
              type: ContentType.LI,
              text: 'No tengas miedo de ser directo - Mejor preguntar ahora que arrepentirse después',
            },
            { type: ContentType.LI, text: 'Sé cortés y agradecido - Están haciendo un favor' },
            {
              type: ContentType.LI,
              text: 'Usa la información sabiamente - No para chismear, sino para decidir informadamente',
            },
            {
              type: ContentType.LI,
              text: 'Paga el favor hacia adelante - Ayuda a futuros inquilinos cuando te pregunten',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Un propietario bueno no tendrá problema con que hables con vecinos. Un propietario malo intentará evitarlo.',
        },
        {
          type: ContentType.P,
          text: 'Si alguien te presiona para firmar rápido sin darte tiempo de hablar con vecinos, esa es tu señal de salir corriendo en dirección contraria.',
        },
        {
          type: ContentType.P,
          text: '20 minutos hablando con vecinos pueden ahorrarte 12 meses de miseria, miles de dólares en problemas, y proteger tu calidad de vida.',
        },
        {
          type: ContentType.P,
          text: 'Es la investigación más fácil, gratuita, y valiosa que harás. Hazla siempre.',
        },
      ],
    ],
  },
  {
    id: 11,
    title: 'Verifica servicios e impuestos',
    excerpt:
      'Confirma qué servicios (agua, gas, internet) están incluidos. Pregunta por deudas de impuestos o expensas que el próximo inquilino podría heredar.',
    category: ArticleType.TIPS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Una de las sorpresas más desagradables y costosas que puedes tener como inquilino es descubrir, después de mudarte, que la propiedad tiene deudas acumuladas de servicios, impuestos o expensas que ahora son tu responsabilidad, o que los servicios "incluidos" en realidad no lo están, o que el costo real de servicios duplica o triplica lo que esperabas pagar.',
        },
        {
          type: ContentType.P,
          text: 'Estas sorpresas pueden agregar cientos o miles de dólares anuales a tu presupuesto, convertir una "ganga" en una pesadilla financiera, o incluso dejarte sin servicios básicos si hay cortes por falta de pago.',
        },
        {
          type: ContentType.P,
          text: 'Esta guía te enseñará exactamente qué verificar, cómo hacerlo, qué documentos pedir, y cómo protegerte de heredar deudas que no son tuyas.',
        },
      ],
      // Por Qué es Crítico
      [
        { type: ContentType.H2, text: 'Por Qué es Crítico Verificar Servicios e Impuestos' },
        { type: ContentType.H3, text: 'Consecuencias de NO verificar' },
        {
          type: ContentType.P,
          text: 'Financieras: Deudas heredadas que legalmente debes pagar, costos de servicios mucho más altos de lo esperado, cargos ocultos no mencionados por el propietario, cortes de servicio por deudas del propietario anterior, multas e intereses acumulados, presupuesto mensual completamente descontrolado.',
        },
        {
          type: ContentType.P,
          text: 'Legales: En muchas jurisdicciones, las deudas de servicios "siguen a la propiedad". Empresas de servicios pueden exigirte pago de deudas previas antes de conectar, imposibilidad de tener servicios a tu nombre sin saldar deudas, problemas legales si deudas de impuestos son significativas.',
        },
        {
          type: ContentType.P,
          text: 'Calidad de vida: Vivir sin agua, electricidad, gas o internet por cortes, estrés de lidiar con empresas de servicios y deudas, peleas con propietarios sobre quién debe pagar qué, sorpresas desagradables cada mes al recibir facturas.',
        },
        { type: ContentType.H3, text: 'Historias reales' },
        {
          type: ContentType.P,
          text: '❌ "Heredé $3,000 de deuda de luz": Firmé el contrato sin pedir ver las facturas. A las dos semanas me cortaron la luz. La empresa de electricidad me dijo que había deuda de $3,000 del inquilino anterior y que no me conectarían hasta que pagara. El propietario se desentendió diciendo que "eso es entre tú y la empresa". Tuve que pagar para tener luz.',
        },
        {
          type: ContentType.P,
          text: '❌ "Los servicios incluidos no lo estaban": El anuncio decía "servicios incluidos". Resulta que solo incluía agua fría. Luz, gas, internet, agua caliente... todo era aparte. Mi presupuesto se fue al doble.',
        },
        {
          type: ContentType.P,
          text: '❌ "Impuestos atrasados = problema mío": No sabía que el propietario tenía 2 años de impuestos municipales sin pagar. La municipalidad puso un embargo sobre la propiedad. Cuando quise salir, no pude recuperar mi depósito porque estaba "congelado" por la deuda fiscal.',
        },
        {
          type: ContentType.P,
          text: '❌ "Expensas altísimas no reveladas": Me dijeron que las expensas eran $100/mes. En realidad eran $350 porque había una cuota especial por reparaciones del edificio que iba a durar 2 años más. Nadie me lo mencionó.',
        },
      ],
      // Qué Servicios Verificar
      [
        { type: ContentType.H2, text: 'Qué Servicios Debes Verificar' },
        { type: ContentType.H3, text: 'Servicios básicos' },
        {
          type: ContentType.P,
          text: '1. Electricidad: Proveedor, número de cuenta/medidor, consumo promedio mensual, costo promedio mensual, deudas pendientes, estado del servicio (activo, cortado, en mora).',
        },
        {
          type: ContentType.P,
          text: '2. Agua: ¿Agua caliente incluida o separada? Sistema (red municipal, pozo, tanque), consumo y costo promedio, deudas pendientes, calidad del agua.',
        },
        {
          type: ContentType.P,
          text: '3. Gas: Tipo (natural/red, envasado/garrafas). Si es red: deudas, consumo, costo. Si es envasado: ¿quién paga? ¿cuánto cuesta por mes? Sistema de calefacción y cocina.',
        },
        {
          type: ContentType.P,
          text: '4. Internet/Cable: ¿Hay instalación existente? Proveedor actual, velocidad real disponible, costo de planes disponibles, ¿deudas pendientes?',
        },
        {
          type: ContentType.P,
          text: '5. Recolección de basura: ¿Incluido en impuestos o pago separado? Frecuencia, costos.',
        },
        {
          type: ContentType.P,
          text: '6. Sistemas de seguridad: Alarmas, cámaras, costos de monitoreo mensual, contratos vigentes.',
        },
        { type: ContentType.H3, text: 'Impuestos y contribuciones' },
        {
          type: ContentType.P,
          text: '1. Impuesto inmobiliario/predial: Monto anual, ¿quién paga? (típicamente propietario, pero verifica), ¿está al día?, fecha de vencimiento.',
        },
        {
          type: ContentType.P,
          text: '2. Contribuciones especiales: Mejoras del barrio, pavimentación, alumbrado público, otros cargos municipales.',
        },
        {
          type: ContentType.P,
          text: '3. Expensas/Gastos comunes (en edificios): Monto mensual actual, ¿qué incluyen?, cuotas especiales vigentes, deudas del propietario, historial de aumentos.',
        },
      ],
      // Documentos que DEBES Pedir
      [
        { type: ContentType.H2, text: 'Documentos que DEBES Pedir' },
        { type: ContentType.H3, text: 'Antes de firmar' },
        { type: ContentType.P, text: '✅ Facturas de servicios (últimos 3-6 meses):' },
        {
          type: ContentType.P,
          text: 'Por qué 3-6 meses: Ves patrones de consumo, identificas estacionalidad (ej: luz más alta en verano por AC), verificas que no hay deudas crecientes, calculas promedio real.',
        },
        { type: ContentType.P, text: 'Qué buscar en las facturas:' },
        {
          type: ContentType.P,
          text: '✓ Estado de cuenta: ¿Hay saldo pendiente? ¿Está al día o en mora? ¿Hay avisos de corte?',
        },
        {
          type: ContentType.P,
          text: '✓ Consumo: ¿Es razonable o excesivo? ¿Varía mucho mes a mes? (puede indicar problemas)',
        },
        {
          type: ContentType.P,
          text: 'Ejemplo: Si luz varía de $50 a $300 sin razón aparente, puede haber: problemas eléctricos (fugas), inquilino anterior minaba criptomonedas, electrodomésticos ineficientes, errores de facturación.',
        },
        {
          type: ContentType.P,
          text: '✓ Nombre del titular: ¿A nombre de quién está? ¿Es el propietario o alguien más? Red flag: Si está a nombre de alguien que no es el propietario (inquilino anterior), puede haber deuda y nadie responsabilizándose.',
        },
        {
          type: ContentType.P,
          text: '✅ Certificados de no adeudamiento: Pide al propietario certificados recientes (máximo 30 días) de luz, agua, gas, impuestos municipales, y expensas. ESTOS DOCUMENTOS PRUEBAN QUE NO HAY DEUDAS. Si el propietario se niega o pone excusas, RED FLAG ENORME.',
        },
        {
          type: ContentType.P,
          text: '✅ Comprobante de pago de impuestos: Último recibo de impuesto predial pagado, comprobante de pago de contribuciones especiales.',
        },
        {
          type: ContentType.P,
          text: '✅ Última liquidación de expensas (si aplica): Detalle de qué se incluye, monto mensual actual, cuotas extraordinarias vigentes, estado de cuenta del propietario.',
        },
        {
          type: ContentType.P,
          text: '✅ Contratos de servicios vigentes: Si hay servicios con contratos (internet, cable, alarma, etc.), verifica: ¿a nombre de quién están?, ¿cuánto tiempo les queda?, ¿puedes transferirlos o debes cancelar y hacer nuevos?, ¿hay penalizaciones por cancelación?',
        },
      ],
      // Cómo Verificar con Proveedores
      [
        { type: ContentType.H2, text: 'Cómo Verificar Directamente con Proveedores' },
        { type: ContentType.H3, text: 'No te fíes solo de lo que dice el propietario' },
        {
          type: ContentType.P,
          text: 'Verifica independientemente con cada proveedor de servicios.',
        },
        { type: ContentType.H3, text: 'Proceso de verificación' },
        {
          type: ContentType.P,
          text: '1. Identifica proveedores: Pregunta al propietario quién provee cada servicio, verifica en facturas que te muestre, o busca online proveedores de la zona.',
        },
        {
          type: ContentType.P,
          text: '2. Contacta directamente - Script de llamada: "Hola, estoy considerando alquilar la propiedad en [dirección]. ¿Podrían confirmarme si hay servicio activo en esa dirección y si existe alguna deuda pendiente asociada a esa ubicación? Número de cuenta/medidor: [si lo tienes]."',
        },
        {
          type: ContentType.P,
          text: 'Qué preguntar: ¿Hay servicio activo? ¿Existe deuda pendiente en esa dirección? Si hay deuda, ¿cuánto es? ¿La deuda debe pagarse antes de activar servicio a tu nombre? ¿Cuál es el proceso para transferir el servicio a tu nombre? ¿Qué documentos necesitas? ¿Hay depósito o costos de activación?',
        },
        {
          type: ContentType.P,
          text: '3. Para impuestos - Municipalidad/Gobierno local: Muchas municipalidades tienen portales web donde puedes consultar deudas por dirección, ventanillas de atención donde puedes preguntar, o líneas telefónicas de consulta. Proceso: "Quisiera consultar si la propiedad en [dirección completa] tiene impuestos o contribuciones pendientes." Algunas jurisdicciones te darán la información, otras solo al propietario. Si no te la dan directamente, exige al propietario certificado reciente.',
        },
        {
          type: ContentType.P,
          text: '4. Para expensas (edificios) - Administración del edificio: Contacta al administrador o habla con el encargado/portero. Pregunta por deudas del propietario de la unidad específica. Qué preguntar: ¿El propietario de la unidad X está al día con expensas? ¿Cuál es el monto mensual actual? ¿Hay cuotas extraordinarias vigentes? ¿Cuánto son y por cuánto tiempo? ¿Hay proyectos futuros que aumentarán las expensas?',
        },
      ],
      // Qué Debe Estar en el Contrato
      [
        { type: ContentType.H2, text: 'Qué Debe Estar en el Contrato' },
        { type: ContentType.H3, text: 'Cláusulas críticas sobre servicios' },
        {
          type: ContentType.P,
          text: '✅ Servicios incluidos en la renta: Debe especificar EXACTAMENTE: "La renta mensual de $XXX incluye los siguientes servicios: [lista específica: agua fría, agua caliente, recolección de basura, etc.]" NO ACEPTES: "Servicios incluidos" (¿cuáles?) o "Algunos servicios incluidos" (¿cuáles específicamente?)',
        },
        {
          type: ContentType.P,
          text: '✅ Servicios que paga el inquilino: "El inquilino es responsable de pagar directamente los siguientes servicios: electricidad, gas, internet, cable, etc."',
        },
        {
          type: ContentType.P,
          text: '✅ Estado de servicios al inicio: "El propietario garantiza que todos los servicios están activos y sin deudas pendientes al momento de la entrega de la propiedad."',
        },
        {
          type: ContentType.P,
          text: '✅ Responsabilidad por deudas previas: "El propietario es responsable de cualquier deuda de servicios, impuestos, o expensas generada antes de [fecha de inicio del contrato]. El inquilino no será responsable de deudas previas a su ocupación." ESTO TE PROTEGE LEGALMENTE.',
        },
        {
          type: ContentType.P,
          text: '✅ Expensas/Gastos comunes: "El inquilino pagará mensualmente $XXX en concepto de expensas/gastos comunes, que incluyen: [detallar: mantenimiento de áreas comunes, ascensor, seguridad, agua, etc.]. El propietario notificará al inquilino con 30 días de anticipación de cualquier aumento o cuota extraordinaria, y proporcionará la liquidación detallada."',
        },
        {
          type: ContentType.P,
          text: '✅ Impuestos: "El propietario es responsable del pago de todos los impuestos inmobiliarios y contribuciones relacionadas con la propiedad." En algunos lugares, el propietario puede trasladar legalmente el impuesto al inquilino. Si es el caso: "El inquilino pagará el impuesto inmobiliario anual de $XXX, dividido en [X] cuotas mensuales de $XXX, además de la renta. El propietario proporcionará copia del recibo de impuesto al inicio del contrato."',
        },
        {
          type: ContentType.P,
          text: '✅ Mantenimiento de sistemas: "El propietario es responsable del mantenimiento y reparación de sistemas de calefacción, calentadores de agua, sistemas eléctricos, y tuberías. El inquilino notificará inmediatamente cualquier problema."',
        },
      ],
      // Costos de Conexión/Activación
      [
        { type: ContentType.H2, text: 'Costos de Conexión/Activación' },
        { type: ContentType.H3, text: 'Presupuesta estos costos iniciales' },
        {
          type: ContentType.P,
          text: 'Más allá de renta y depósito, activar servicios tiene costos:',
        },
        {
          type: ContentType.P,
          text: 'Electricidad: Depósito de garantía $100-300, costo de activación $0-100, inspección del medidor $0-50.',
        },
        { type: ContentType.P, text: 'Agua: Depósito $50-150, activación $0-50.' },
        {
          type: ContentType.P,
          text: 'Gas (si es red): Depósito $100-200, revisión de instalación $50-150, activación $0-100.',
        },
        {
          type: ContentType.P,
          text: 'Internet/Cable: Instalación $0-200 (a veces gratis con contrato), equipo $50-150 (router, decodificador), depósito $0-100.',
        },
        { type: ContentType.P, text: 'TOTAL POSIBLE: $400-1,500' },
        {
          type: ContentType.P,
          text: 'CRÍTICO: Pregunta al propietario si los servicios pueden transferirse sin cortar (manteniendo el contrato activo pero cambiando titular). Esto puede ahorrarte todos estos costos de activación.',
        },
      ],
      // Estimación de Costos Mensuales
      [
        { type: ContentType.H2, text: 'Estimación de Costos Mensuales' },
        { type: ContentType.H3, text: 'Crea una tabla de presupuesto real' },
        {
          type: ContentType.P,
          text: 'Servicios: Renta (fijo en contrato), electricidad (basado en facturas históricas), agua, gas, internet (plan que necesitas), cable (opcional), expensas (fijo pero puede aumentar), celular (tu plan actual), limpieza (si aplica), estacionamiento (si no incluido), seguro inquilino (recomendado). TOTAL: Tu costo real mensual.',
        },
        { type: ContentType.P, text: 'Este es tu costo REAL de vivir ahí, no solo la renta.' },
        { type: ContentType.H3, text: 'Regla práctica' },
        {
          type: ContentType.P,
          text: 'Servicios típicamente agregan 15-30% al costo de la renta base. Ejemplo: Renta $1,000 + Servicios $150-300 = Total real $1,150-1,300. Si tu presupuesto es $1,000 todo incluido, debes buscar rentas de máximo $700-850.',
        },
      ],
      // Red Flags Críticos
      [
        { type: ContentType.H2, text: 'Red Flags Críticos' },
        { type: ContentType.H3, text: 'Señales de alerta que indican problemas' },
        {
          type: ContentType.P,
          text: '🚩 Propietario se niega a mostrar facturas: "No tengo las facturas a mano", "Eso es información privada", "No te preocupes por eso". Por qué es malo: Probablemente hay deudas o costos muy altos que oculta. Tu respuesta: "Necesito ver las facturas para tomar una decisión informada. Sin esa información, no puedo proceder."',
        },
        {
          type: ContentType.P,
          text: '🚩 Facturas a nombre de terceros: Si las facturas están a nombre de alguien que no es el propietario (inquilino anterior, otra persona). Problema: Puede haber deudas que nadie se responsabiliza. Cuando quieras poner servicios a tu nombre, la empresa puede exigirte saldar esas deudas.',
        },
        {
          type: ContentType.P,
          text: '🚩 "Servicios incluidos" sin especificar: NUNCA aceptes "servicios incluidos" sin lista específica por escrito en el contrato.',
        },
        {
          type: ContentType.P,
          text: '🚩 Facturas con montos excesivos: Si la electricidad promedio es $300/mes para un apartamento de 1 habitación, algo está mal. Posibles causas: fugas eléctricas, electrodomésticos dañados/ineficientes, mala aislación térmica, medidor compartido (¡estás pagando consumo de otros!), calentador de agua ineficiente. No asumas que "tú consumirás menos". Si la infraestructura es mala, tú también pagarás de más.',
        },
        {
          type: ContentType.P,
          text: '🚩 Deudas "pequeñas" que minimiza: "Solo son $200 de luz atrasados, es nada". Problema: 1. Si $200 es "nada", ¿por qué no los pagó? 2. Si tiene deuda "pequeña" en luz, probablemente tiene en otros servicios. 3. Es señal de irresponsabilidad financiera o problemas económicos.',
        },
        {
          type: ContentType.P,
          text: '🚩 Cambios frecuentes de inquilinos: Si preguntas a vecinos o ves que hay mucha rotación de inquilinos, puede ser por costos ocultos que descubren después de mudarse.',
        },
        {
          type: ContentType.P,
          text: '🚩 Expensas con cuotas "temporales" extensas: "Hay una cuota extraordinaria de $100/mes, pero es solo temporal... durante 3 años". 3 años = $3,600 adicionales que no esperabas.',
        },
      ],
      // Verificaciones Específicas
      [
        { type: ContentType.H2, text: 'Verificaciones Específicas por Tipo de Propiedad' },
        { type: ContentType.H3, text: 'Para casas' },
        {
          type: ContentType.P,
          text: '✅ Sistema séptico (si no hay alcantarillado): ¿Funciona correctamente? ¿Cuándo fue el último mantenimiento? ¿Quién paga limpieza/bombeo? Costo: $100-300 cada 1-3 años.',
        },
        {
          type: ContentType.P,
          text: '✅ Pozo de agua (si no hay red): ¿Funciona la bomba? ¿Calidad del agua? ¿Quién paga mantenimiento? Costo de electricidad de la bomba.',
        },
        {
          type: ContentType.P,
          text: '✅ Sistema de calefacción: Tipo (gas, eléctrico, leña), estado y eficiencia, costo operativo mensual en invierno.',
        },
        {
          type: ContentType.P,
          text: '✅ Jardín: ¿Quién mantiene? (¿tú o propietario?) ¿Quién paga jardinero si se contrata? ¿Quién paga agua de riego?',
        },
        { type: ContentType.H3, text: 'Para departamentos' },
        {
          type: ContentType.P,
          text: '✅ Expensas detalladas: Pide desglose completo de qué incluyen, verifica si agua está en expensas o separada, pregunta por proyectos futuros del edificio.',
        },
        {
          type: ContentType.P,
          text: '✅ Medidores: ¿Individuales o compartidos? Si son compartidos, ¿cómo se divide el costo? CRÍTICO: Medidores compartidos son problemáticos. Pagas por consumo de otros. Evítalos si puedes.',
        },
        {
          type: ContentType.P,
          text: '✅ Amenidades: ¿Costo de uso incluido en expensas? ¿Hay cargos adicionales? (ej: reserva de sala de fiestas)',
        },
      ],
      // Preguntas al Propietario
      [
        { type: ContentType.H2, text: 'Preguntas Directas al Propietario' },
        { type: ContentType.H3, text: 'Script de preguntas esenciales' },
        {
          type: ContentType.P,
          text: '1. Sobre servicios incluidos: "¿Qué servicios están específicamente incluidos en la renta mensual de $XXX? Por favor, lístelos."',
        },
        {
          type: ContentType.P,
          text: '2. Sobre costos: "¿Cuál es el costo promedio mensual de [electricidad/agua/gas/etc.] en esta propiedad?"',
        },
        {
          type: ContentType.P,
          text: '3. Sobre deudas: "¿Puede proporcionarme certificados de no adeudamiento de todos los servicios e impuestos? Necesito asegurarme de que no hay deudas pendientes."',
        },
        {
          type: ContentType.P,
          text: '4. Sobre facturas: "¿Puedo ver las facturas de los últimos 6 meses de todos los servicios?"',
        },
        {
          type: ContentType.P,
          text: '5. Sobre transferencia: "¿Los servicios pueden transferirse a mi nombre manteniendo la conexión activa, o debo solicitar nuevas conexiones?"',
        },
        {
          type: ContentType.P,
          text: '6. Sobre expensas: "¿Cuál es el monto exacto de las expensas mensuales? ¿Hay cuotas extraordinarias vigentes? ¿De cuánto y por cuánto tiempo?"',
        },
        {
          type: ContentType.P,
          text: '7. Sobre aumentos: "¿Cómo han variado los costos de servicios y expensas en el último año?"',
        },
        {
          type: ContentType.P,
          text: '8. Sobre responsabilidades: "Si hay deudas de servicios anteriores a mi mudanza, ¿quién es responsable?"',
        },
        {
          type: ContentType.P,
          text: '9. Sobre mantenimiento: "¿Quién es responsable de mantener sistemas de calefacción, calentadores de agua, y otros sistemas que generan costos de servicios?"',
        },
        {
          type: ContentType.P,
          text: '10. Sobre documentación: "¿Puede incluir en el contrato la lista específica de qué servicios están incluidos y cuáles pago yo, además de una cláusula que me proteja de deudas anteriores?"',
        },
      ],
      // Qué Hacer Si Descubres Problemas
      [
        { type: ContentType.H2, text: 'Qué Hacer Si Descubres Problemas' },
        { type: ContentType.H3, text: 'Si descubres deudas ANTES de firmar' },
        {
          type: ContentType.P,
          text: 'Opción 1: Exige que el propietario salde las deudas antes de tu mudanza. "Estoy interesado en la propiedad, pero necesito que todas las deudas de servicios e impuestos estén saldadas antes de firmar. ¿Puede proporcionarme certificados de no adeudamiento actualizados al momento de la firma?"',
        },
        {
          type: ContentType.P,
          text: 'Opción 2: Negocia un descuento. Si hay deudas menores y el propietario se compromete a pagarlas: "Dado que hay deudas pendientes, me gustaría un descuento de $XXX en los primeros meses de renta mientras se resuelve esto."',
        },
        {
          type: ContentType.P,
          text: 'Opción 3: Busca otra propiedad. Si las deudas son significativas o el propietario es evasivo, es señal de que será un propietario problemático. Mejor buscar otra opción.',
        },
        { type: ContentType.H3, text: 'Si descubres problemas DESPUÉS de mudarte' },
        { type: ContentType.P, text: 'Si hay cortes de servicio por deudas previas:' },
        {
          type: ContentType.P,
          text: '1. Documenta todo: Fecha del corte, comunicaciones con la empresa de servicios, deuda que te mencionan.',
        },
        {
          type: ContentType.P,
          text: '2. Contacta al propietario inmediatamente: Por escrito (email, mensaje), notifica el problema, exige que lo resuelva en 24-48 horas (es emergencia).',
        },
        {
          type: ContentType.P,
          text: '3. Si no responde o se niega: Dependiendo de la ley local, puedes: pagar tú y deducir de la renta (necesitas asesoría legal), retener la renta hasta que se resuelva (¡cuidado! esto puede violar el contrato), terminar el contrato sin penalización por inhabitabilidad, o demandar al propietario por daños.',
        },
        {
          type: ContentType.P,
          text: '4. Consulta abogado: Conoce tus derechos específicos. Muchas jurisdicciones protegen fuertemente a inquilinos en estos casos.',
        },
        {
          type: ContentType.P,
          text: 'Si los costos son mucho más altos de lo que te dijeron: Si no está en el contrato, es tu palabra contra la del propietario. Por eso es CRÍTICO que todo esté por escrito ANTES de firmar.',
        },
      ],
      // Herramientas y Recursos
      [
        { type: ContentType.H2, text: 'Herramientas y Recursos' },
        { type: ContentType.H3, text: 'Checklist de verificación de servicios' },
        { type: ContentType.P, text: 'Imprime esto y úsalo para cada propiedad que consideres:' },
        { type: ContentType.P, text: 'Verificaciones esenciales:' },
        {
          type: ContentType.UL,
          children: [
            {
              type: ContentType.LI,
              text: 'Solicité y revisé facturas de electricidad (últimos 6 meses)',
            },
            { type: ContentType.LI, text: 'Solicité y revisé facturas de agua (últimos 6 meses)' },
            { type: ContentType.LI, text: 'Solicité y revisé facturas de gas (últimos 6 meses)' },
            {
              type: ContentType.LI,
              text: 'Verifiqué que no hay deudas pendientes en ningún servicio',
            },
            {
              type: ContentType.LI,
              text: 'Contacté directamente a proveedores para confirmar estado',
            },
            {
              type: ContentType.LI,
              text: 'Revisé comprobantes de pago de impuestos inmobiliarios',
            },
            {
              type: ContentType.LI,
              text: 'Obtuve certificado de no adeudamiento de impuestos municipales',
            },
            { type: ContentType.LI, text: 'Revisé liquidación de expensas (si aplica)' },
            {
              type: ContentType.LI,
              text: 'Confirmé que no hay cuotas extraordinarias o las identifiqué',
            },
            {
              type: ContentType.LI,
              text: 'Calculé costo mensual REAL (renta + todos los servicios)',
            },
            { type: ContentType.LI, text: 'Verifiqué que mi presupuesto cubre el costo real' },
            { type: ContentType.LI, text: 'Todo está especificado por escrito en el contrato' },
            {
              type: ContentType.LI,
              text: 'Cláusula de protección contra deudas previas está en el contrato',
            },
            {
              type: ContentType.LI,
              text: 'Entiendo proceso y costos de transferir servicios a mi nombre',
            },
            { type: ContentType.LI, text: 'Presupuesté costos de conexión/activación inicial' },
          ],
        },
        { type: ContentType.P, text: 'NO FIRMES hasta que TODOS los ítems estén chequeados.' },
        { type: ContentType.H3, text: 'Plantilla de presupuesto' },
        {
          type: ContentType.P,
          text: 'Crea una hoja de cálculo con esto para cada propiedad que evalúes:',
        },
        {
          type: ContentType.P,
          text: 'Costos mensuales recurrentes: Renta, electricidad (promedio), agua, gas, internet, cable (opcional), expensas, estacionamiento (si no incluido), seguro inquilino, otros. TOTAL MENSUAL: [calcula]',
        },
        {
          type: ContentType.P,
          text: 'Costos iniciales (una vez): Depósito de garantía, primer mes de renta, depósito de electricidad, depósito de agua, depósito de gas, instalación de internet, costos de mudanza. TOTAL INICIAL: [calcula]',
        },
        { type: ContentType.P, text: '¿Puedo pagarlo? SÍ/NO' },
      ],
      // Consejos de Negociación
      [
        { type: ContentType.H2, text: 'Consejos de Negociación' },
        { type: ContentType.H3, text: 'Usa la información de servicios como leverage' },
        {
          type: ContentType.P,
          text: 'Si los costos son altos: "Las facturas muestran que la electricidad promedio es $250/mes, que es alto para una unidad de este tamaño. ¿Hay algún problema con la aislación o los electrodomésticos? ¿Podríamos acordar un precio de renta más bajo para compensar estos altos costos de servicios?"',
        },
        {
          type: ContentType.P,
          text: 'Si hay deudas menores: "Entiendo que hay una pequeña deuda de $XXX en [servicio]. Estoy dispuesto a proceder si usted la salda antes de la firma y me proporciona el comprobante de pago."',
        },
        {
          type: ContentType.P,
          text: 'Si las expensas van a aumentar: "Veo que hay un proyecto de reparación que aumentará las expensas en $100/mes. ¿Podríamos congelar el precio de la renta durante el primer año para compensar este aumento?"',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Verificar servicios e impuestos es TAN importante como inspeccionar la propiedad física. Deudas ocultas o costos no revelados pueden: convertir una "buena oferta" en una pesadilla cara, dejarte sin servicios básicos, causar estrés financiero y legal, arruinar completamente tu experiencia de alquiler.',
        },
        { type: ContentType.P, text: 'Reglas de oro:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: 'Exige ver facturas de los últimos 6 meses de TODOS los servicios',
            },
            {
              type: ContentType.LI,
              text: 'Pide certificados de no adeudamiento escritos y recientes',
            },
            { type: ContentType.LI, text: 'Verifica independientemente con proveedores' },
            {
              type: ContentType.LI,
              text: 'Todo por escrito en el contrato: servicios incluidos, responsabilidades, protección contra deudas previas',
            },
            {
              type: ContentType.LI,
              text: 'Calcula el costo REAL mensual: renta + todos los servicios',
            },
            {
              type: ContentType.LI,
              text: 'Presupuesta costos iniciales de conexión: pueden ser $500-1,500',
            },
            {
              type: ContentType.LI,
              text: 'Si algo no cuadra, investiga más o busca otra propiedad',
            },
            {
              type: ContentType.LI,
              text: 'Nunca firmes sin tener claridad total sobre costos y deudas',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Un propietario honesto y profesional no tendrá problema en proporcionar esta información. Uno que se niega o es evasivo es una red flag gigante.',
        },
        {
          type: ContentType.P,
          text: '30 minutos verificando servicios e impuestos pueden ahorrarte miles de dólares y meses de problemas.',
        },
        {
          type: ContentType.P,
          text: 'No asumas nada. No confíes solo en palabras. VERIFICA TODO.',
        },
        { type: ContentType.P, text: 'Tu billetera y tu paz mental te lo agradecerán.' },
      ],
    ],
  },
  {
    id: 12,
    title: 'Solicita referencias',
    excerpt:
      'Pide referencias de otros inquilinos que alquilaron la propiedad. Pregunta sobre la responsabilidad del dueño para mantenimiento y reparos.',
    category: ArticleType.CONTRACTS,
    date: 'Nov 18, 2024',
    readTime: '10 min',
    content: [
      // Introducción
      [
        { type: ContentType.H2, text: 'Introducción' },
        {
          type: ContentType.P,
          text: 'Cuando contratas a alguien para un trabajo importante, pides referencias. Cuando un empleador considera contratarte, pide referencias. ¿Por qué entonces firmamos contratos de alquiler - compromisos de miles de dólares durante meses o años - sin verificar referencias del propietario?',
        },
        {
          type: ContentType.P,
          text: 'Solicitar y verificar referencias es una de las mejores formas de descubrir cómo es realmente un propietario, más allá de la imagen que proyecta durante las visitas. Referencias honestas pueden revelarte patrones de comportamiento, advertirte sobre problemas recurrentes, o confirmar que estás tomando una excelente decisión.',
        },
        {
          type: ContentType.P,
          text: 'Esta guía te enseñará qué referencias pedir, cómo obtenerlas, qué preguntar, y cómo interpretarlas correctamente.',
        },
      ],
      // Por Qué las Referencias Son Esenciales
      [
        { type: ContentType.H2, text: 'Por Qué las Referencias Son Esenciales' },
        { type: ContentType.H3, text: 'Lo que las referencias revelan' },
        {
          type: ContentType.P,
          text: 'Comportamiento real del propietario: ¿Cumple promesas o solo dice lo que quieres oír? ¿Responde rápido a problemas o desaparece? ¿Es razonable y profesional o conflictivo? ¿Respeta tu privacidad o es intrusivo? ¿Es justo con el depósito o busca excusas para retenerlo?',
        },
        {
          type: ContentType.P,
          text: 'Patrones que no verías de otra forma: Si MÚLTIPLES inquilinos anteriores reportan lo mismo, es un patrón real. Problemas recurrentes que el propietario no ha solucionado. Su estilo de comunicación y resolución de conflictos. Cómo maneja aumentos de renta. Su actitud cuando hay problemas.',
        },
        {
          type: ContentType.P,
          text: 'Problemas ocultos de la propiedad: Defectos que reaparecen (plomería que se tapa, goteras, etc.), promesas no cumplidas de reparaciones, problemas con vecinos o el edificio, costos ocultos que no mencionó.',
        },
        {
          type: ContentType.P,
          text: 'Calidad de vida real: ¿Los inquilinos anteriores fueron felices? ¿Renovaron o se fueron apenas pudieron? ¿Recomendarían alquilar con este propietario? ¿Volverían a alquilar con él?',
        },
        { type: ContentType.H3, text: 'Historias reales que habrías evitado con referencias' },
        {
          type: ContentType.P,
          text: '❌ "Prometió arreglar todo, no arregló nada": El propietario me prometió que pintaría antes de mudarme, que arreglaría la llave que goteaba, y que cambiaría el termotanque viejo. Nada de eso pasó. Si hubiera hablado con el inquilino anterior, me habría dicho: "A mí me prometió lo mismo, no creas nada que no esté por escrito y ya hecho". Me mudé con problemas desde el día uno.',
        },
        {
          type: ContentType.P,
          text: '❌ "Era imposible contactarlo": El primer mes todo bien. Después, cuando empezaron los problemas, desaparecía. No contestaba llamadas, ignoraba mensajes, tardaba semanas en responder. El inquilino anterior me dijo después: "Es su patrón, cuando ya firmaste y pagaste, no le importas". Viví 14 meses con ese estrés.',
        },
        {
          type: ContentType.P,
          text: '❌ "Retuvo el depósito injustamente": Dejé el apartamento impecable. Aún así, el propietario encontró excusas para retener $800 de mi depósito de $1,200. Cuando hablé con el inquilino anterior, me dijo: "A mí me hizo lo mismo. Demanda a todos. Habría peleado mi depósito desde el principio si lo hubiera sabido". Nunca recuperé ese dinero.',
        },
        {
          type: ContentType.P,
          text: '❌ "La propiedad tenía el mismo problema crónico": A los dos meses, empezaron filtraciones del techo en temporada de lluvias. El propietario las "arregló" temporalmente pero volvieron. Resulta que los últimos 3 inquilinos tuvieron el mismo problema. Es un defecto estructural que él parchea pero nunca soluciona. Las referencias me habrían advertido.',
        },
      ],
      // Qué Referencias Pedir
      [
        { type: ContentType.H2, text: 'Qué Referencias Pedir' },
        { type: ContentType.H3, text: 'Referencias de inquilinos anteriores' },
        { type: ContentType.P, text: 'La más valiosa: el inquilino inmediatamente anterior' },
        {
          type: ContentType.P,
          text: 'Por qué: Experiencia más reciente, misma propiedad que tú estás considerando, sabe el estado actual de sistemas y electrodomésticos, información fresca sobre el propietario.',
        },
        {
          type: ContentType.P,
          text: 'Pide: Nombre y contacto (teléfono o email), ¿por cuánto tiempo alquiló?, ¿por qué se fue?',
        },
        { type: ContentType.P, text: 'También valiosos: inquilinos de hace 2-3 años' },
        {
          type: ContentType.P,
          text: 'Por qué: Te dan perspectiva histórica, si varios inquilinos de diferentes épocas dicen lo mismo es patrón consistente, pueden haber tenido tiempo de reflexionar objetivamente sobre la experiencia.',
        },
        { type: ContentType.H3, text: 'Referencias de otros inquilinos del propietario' },
        {
          type: ContentType.P,
          text: 'Si el propietario tiene múltiples propiedades: Pide contactos de inquilinos actuales en otras propiedades.',
        },
        {
          type: ContentType.P,
          text: 'Por qué es útil: Mismas políticas y estilo de manejo, pueden hablar de su experiencia actual (más creíble), te dicen cómo es como propietario más allá de una propiedad específica.',
        },
        { type: ContentType.H3, text: 'Referencias profesionales' },
        {
          type: ContentType.P,
          text: 'Administradores de propiedad: Si el propietario trabaja con administradores, pide contacto de la empresa/persona, años de relación laboral, su opinión profesional.',
        },
        {
          type: ContentType.P,
          text: 'Contratistas/Técnicos: Si el propietario menciona que usa ciertos plomeros, electricistas, etc.: ¿Qué tan rápido los llama cuando hay problemas? ¿Paga puntualmente? ¿Es razonable o difícil de trabajar?',
        },
        {
          type: ContentType.P,
          text: 'Por qué importa: Un propietario que no paga bien a sus contratistas, tampoco los llamará rápido cuando tú tengas problemas.',
        },
        { type: ContentType.H3, text: 'Referencias del edificio (si aplica)' },
        {
          type: ContentType.P,
          text: 'Administración del consorcio: ¿El propietario paga expensas a tiempo? ¿Ha tenido conflictos con vecinos o administración? ¿Es responsable con el mantenimiento de su unidad? ¿Responde cuando hay problemas que afectan a otros?',
        },
        {
          type: ContentType.P,
          text: 'Por qué importa: Un propietario irresponsable con el edificio será irresponsable contigo.',
        },
      ],
      // Cómo Obtener Referencias
      [
        { type: ContentType.H2, text: 'Cómo Obtener Referencias' },
        { type: ContentType.H3, text: 'Paso 1: Solicita al propietario' },
        { type: ContentType.P, text: 'Cuándo: Durante negociaciones, antes de firmar.' },
        {
          type: ContentType.P,
          text: 'Cómo: "Me interesa mucho la propiedad. Como parte de mi proceso de decisión, ¿podría proporcionarme contactos de 2-3 inquilinos anteriores para referencias? Es estándar en mi proceso de evaluación."',
        },
        {
          type: ContentType.P,
          text: 'Variación más suave: "¿Sería posible hablar con el inquilino anterior? Me gustaría preguntarle sobre su experiencia y la propiedad."',
        },
        { type: ContentType.H3, text: 'Reacciones del propietario y qué significan' },
        {
          type: ContentType.P,
          text: '✅ Respuesta positiva (excelente señal): "Por supuesto, te paso el contacto de [nombre]. Fueron excelentes inquilinos durante 3 años. También puedo darte el contacto de [nombre] que alquila otra propiedad mía." Interpretación: Propietario profesional, seguro de sí mismo, con buenas relaciones con sus inquilinos. Muy buena señal.',
        },
        {
          type: ContentType.P,
          text: '⚠️ Respuesta con vacilación: "Mmm, tendría que buscar sus datos... déjame ver si los encuentro..." Interpretación: Puede ser desorganización o puede estar evitando darte información. Presiona educadamente pero firmemente.',
        },
        {
          type: ContentType.P,
          text: '🚨 Respuesta defensiva/negativa (RED FLAG ENORME): "No acostumbro dar datos de inquilinos anteriores, es privacidad de ellos" / "¿Para qué necesitas eso? ¿No confías en mí?" / "Eso no es necesario, puedes confiar en mi palabra" / "Todos mis inquilinos han estado contentos, no necesitas referencias". Interpretación: ¿Por qué un propietario se negaría a dar referencias si tiene inquilinos satisfechos? Porque probablemente no los tiene. MASSIVE RED FLAG. Considera seriamente buscar otra propiedad.',
        },
        {
          type: ContentType.H3,
          text: 'Paso 2: Contacta al inquilino anterior directamente (si el propietario no ayuda)',
        },
        { type: ContentType.P, text: 'Métodos alternativos:' },
        {
          type: ContentType.P,
          text: 'A. Pregunta a vecinos: Cuando visites la propiedad, pregunta a vecinos: "¿Sabe cómo puedo contactar al inquilino anterior? Me gustaría preguntarle sobre su experiencia aquí." Vecinos a menudo tienen esa información o pueden hacer la conexión.',
        },
        {
          type: ContentType.P,
          text: 'B. Búsqueda en redes sociales: Si sabes el nombre del inquilino anterior (puede aparecer en buzones, vecinos lo mencionan, etc.): Facebook, LinkedIn, Instagram. Envía mensaje educado explicando por qué contactas.',
        },
        {
          type: ContentType.P,
          text: 'C. Deja tu información: Si la propiedad está aún ocupada o recién desocupada, deja una nota en el buzón o pide a vecinos que pasen tu contacto. Nota en el buzón: "Para el inquilino de [dirección]: Estoy considerando alquilar este lugar. ¿Podrías contactarme para contarme sobre tu experiencia? [Tu email/teléfono]. ¡Gracias!"',
        },
        { type: ContentType.H3, text: 'Paso 3: Busca reseñas online' },
        {
          type: ContentType.P,
          text: 'Dónde buscar: Google "[Nombre del propietario] propietario opiniones", grupos de Facebook de inquilinos de tu ciudad, sitios web de reseñas de propietarios (varían por país), foros de inquilinos, grupos de Reddit locales.',
        },
        {
          type: ContentType.P,
          text: 'Qué buscar: Menciones del propietario por nombre, menciones de la dirección específica, patrones en múltiples reseñas.',
        },
        {
          type: ContentType.P,
          text: 'Cuidado con: Reseñas falsas (muy positivas, genéricas, sin detalles), una sola reseña negativa de alguien claramente problemático (puede no ser culpa del propietario), información muy antigua (personas y políticas cambian).',
        },
        {
          type: ContentType.P,
          text: 'Confía en: Múltiples reseñas consistentes con detalles específicos.',
        },
      ],
      // Las 15 Preguntas Críticas
      [
        { type: ContentType.H2, text: 'Las 15 Preguntas Críticas para Referencias' },
        { type: ContentType.H3, text: 'Cuando hables con inquilinos anteriores, pregunta' },
        {
          type: ContentType.P,
          text: '1. "¿Por cuánto tiempo alquilaste la propiedad?" - Por qué importa: Inquilinos que se quedaron mucho tiempo generalmente estaban contentos. Rotación rápida es red flag.',
        },
        {
          type: ContentType.P,
          text: '2. "¿Por qué te mudaste?" - Escucha atento. ✅ Buenas razones: Cambio de ciudad/trabajo, compró propiedad, necesitaba más/menos espacio por cambio familiar, fin de contrato y ya tenía otros planes. 🚨 Malas razones: Problemas con el propietario, propiedad en mal estado, problemas sin resolver, aumento excesivo de renta, no podía más con [situación].',
        },
        {
          type: ContentType.P,
          text: '3. "¿Cómo describirías tu experiencia como inquilino de [propietario]?" - Pregunta abierta, deja que hablen libremente. Su tono y espontaneidad te dirán tanto como sus palabras.',
        },
        {
          type: ContentType.P,
          text: '4. "¿Qué tan rápido respondía a problemas y solicitudes de reparación?" - CRÍTICO: La diferencia entre un buen y mal propietario es el tiempo de respuesta. Respuestas que quieres escuchar: "Muy rápido, generalmente en 24-48 horas", "Siempre atento, nunca tuve que perseguirlo", "Tenía técnicos de confianza que mandaba inmediatamente". Red flags: "Tardaba semanas en responder", "Tenía que llamar múltiples veces", "Algunas cosas nunca las arregló", "Tuve que hacerlo yo mismo".',
        },
        {
          type: ContentType.P,
          text: '5. "¿Hubo problemas recurrentes en la propiedad? ¿Cuáles?" - Buscas: Defectos crónicos que el propietario no ha solucionado realmente. Ejemplos preocupantes: Plomería que se tapa constantemente, goteras que reaparecen, problemas eléctricos frecuentes, calefacción/AC que falla regularmente, plagas recurrentes.',
        },
        {
          type: ContentType.P,
          text: '6. "¿El propietario cumplió todas las promesas que hizo antes de que te mudaras?" - SÚPER CRÍTICO: Aquí descubres si es confiable o dice lo que sea para que firmes. Respuesta ideal: "Sí, todo lo que prometió lo cumplió." Red flag: "No, me prometió [X, Y, Z] y nunca lo hizo."',
        },
        {
          type: ContentType.P,
          text: '7. "¿Cómo fue el proceso de devolución del depósito?" - Reveladísimo: Muestra cómo es el propietario cuando ya no le sirves. Respuestas buenas: "Me devolvió todo", "Descontó solo daños reales, me mostró fotos y recibos", "Proceso transparente, sin problemas", "Me lo devolvió en [tiempo razonable]". Red flags: "Retuvo casi todo por cosas injustas", "Tardó meses en devolver", "Tuve que amenazar legalmente", "Nunca me explicó bien los descuentos", "Mejor ni te cuento..." (mala señal).',
        },
        {
          type: ContentType.P,
          text: '8. "¿Aumentó la renta durante tu estadía? ¿Cuánto?" - Buscas: Patrones de aumentos razonables vs. abusivos. Razonable: Ajustes anuales según inflación (3-5%). Red flag: Aumentos grandes (15%+) arbitrarios.',
        },
        {
          type: ContentType.P,
          text: '9. "¿Respetaba tu privacidad?" - Problemas a detectar: Entraba sin avisar, aparecía inesperadamente frecuentemente, llamaba/escribía excesivamente, era intrusivo. Lo que quieres oír: "Siempre avisaba con anticipación, muy respetuoso."',
        },
        {
          type: ContentType.P,
          text: '10. "¿Hubo alguna situación difícil? ¿Cómo la manejó el propietario?" - Revela: Cómo maneja conflictos y situaciones de estrés. Buenos ejemplos: "Una vez tuve que pagar la renta 5 días tarde por problemas bancarios. Le avisé, fue comprensivo, sin problema", "Hubo una filtración de la unidad de arriba. Coordinó todo, resolvió rápido, sin culparme". Malos ejemplos: "Cualquier cosa pequeña se volvía conflicto", "Era muy difícil de tratar", "Se enojaba fácilmente".',
        },
        {
          type: ContentType.P,
          text: '11. "¿Conoces a otros inquilinos de este propietario? ¿Qué han dicho de su experiencia?" - Por qué útil: Te da acceso a más referencias y confirma patrones.',
        },
        {
          type: ContentType.P,
          text: '12. "¿Volverías a alquilar con este propietario?" - LA PREGUNTA MÁS IMPORTANTE. Respuesta sin vacilación "Sí" = Excelente señal. Cualquier vacilación o "depende" o "no" = Profundiza en el por qué.',
        },
        {
          type: ContentType.P,
          text: '13. "¿Qué es lo mejor y lo peor de alquilar con [propietario]?" - Balance: Nadie es perfecto. Lo que quieres saber es si los pros superan los contras.',
        },
        {
          type: ContentType.P,
          text: '14. "¿Hay algo que desearías haber sabido antes de firmar el contrato?" - Oro puro: Información que puede ahorrarte problemas.',
        },
        {
          type: ContentType.P,
          text: '15. "¿Me recomendarías alquilar esta propiedad / con este propietario?" - Pregunta final de cierre. Respuesta ideal: "Sí, sin dudarlo. Fue una buena experiencia." Red flags: Vacilación, "tal vez", "depende de ti", o "buscaría otras opciones".',
        },
      ],
      // Cómo Hacer las Llamadas/Mensajes
      [
        { type: ContentType.H2, text: 'Cómo Hacer las Llamadas/Mensajes' },
        { type: ContentType.H3, text: 'Por teléfono' },
        {
          type: ContentType.P,
          text: 'Script de inicio: "Hola [nombre], soy [tu nombre]. Me dio tu contacto [propietario/vecino] porque estoy considerando alquilar [dirección] y me gustaría conocer tu experiencia como inquilino anterior. ¿Tienes unos 10-15 minutos para conversar?"',
        },
        { type: ContentType.P, text: 'Tono: Amigable, agradecido, no acusatorio.' },
        { type: ContentType.P, text: 'Duración: 10-20 minutos es suficiente.' },
        {
          type: ContentType.P,
          text: 'Cierre: "Muchísimas gracias por tu tiempo y honestidad. Me has ayudado mucho en mi decisión. ¿Puedo contactarte si tengo alguna pregunta adicional?"',
        },
        { type: ContentType.H3, text: 'Por email o mensaje' },
        {
          type: ContentType.P,
          text: 'Asunto: Consulta sobre experiencia como inquilino en [dirección]',
        },
        {
          type: ContentType.P,
          text: 'Cuerpo: "Hola [nombre], Estoy considerando alquilar [dirección] con [propietario] y me gustaría conocer tu experiencia como inquilino anterior. ¿Podrías contarme: ¿Cómo fue tu experiencia general? ¿Cómo era el propietario en responder a problemas? ¿Hubo algo que desearías haber sabido antes de mudarte? ¿Recomendarías alquilar ahí? Cualquier información que puedas compartir me sería muy útil. Gracias por tu tiempo, [Tu nombre] [Tu contacto]"',
        },
      ],
      // Interpretando las Respuestas
      [
        { type: ContentType.H2, text: 'Interpretando las Respuestas' },
        { type: ContentType.H3, text: 'Señales muy positivas (luz verde)' },
        {
          type: ContentType.P,
          text: '✅ Entusiasmo genuino: "Fue genial vivir ahí. [Propietario] era muy responsable."',
        },
        {
          type: ContentType.P,
          text: '✅ Ejemplos específicos de buen comportamiento: "Cuando se rompió el calentador, mandó un técnico el mismo día y pagó todo sin problema."',
        },
        {
          type: ContentType.P,
          text: '✅ Estancia larga: "Estuve 4 años, solo me fui porque compré mi casa."',
        },
        {
          type: ContentType.P,
          text: '✅ Respuesta a última pregunta sin dudas: "¿Que si lo recomiendo? 100%. Alquila tranquilo."',
        },
        {
          type: ContentType.P,
          text: '✅ Se mantiene en contacto con el propietario: "Todavía hablamos de vez en cuando, es buena persona." Señal de relación positiva post-inquilino.',
        },
        { type: ContentType.H3, text: 'Señales de alerta (luz amarilla)' },
        {
          type: ContentType.P,
          text: '⚠️ Respuestas vagas: "Estuvo... ok, supongo." No necesariamente malo, pero investiga más.',
        },
        {
          type: ContentType.P,
          text: '⚠️ Pequeños problemas mencionados: "A veces tardaba un poco en responder, pero eventualmente resolvía." Nadie es perfecto. Evalúa si son tolerables para ti.',
        },
        {
          type: ContentType.P,
          text: '⚠️ Vacilación en recomendar: "Mmm, depende de lo que busques..." Profundiza: ¿Depende de qué específicamente?',
        },
        {
          type: ContentType.P,
          text: '⚠️ Un problema específico pero aislado: "Tuvimos un conflicto sobre quién debía pagar una reparación, pero se resolvió." Puede ser situación única. Pregunta cómo se resolvió.',
        },
        { type: ContentType.H3, text: 'Señales graves (luz roja)' },
        {
          type: ContentType.P,
          text: '🚨 Advertencia directa: "Personalmente, buscaría otra opción" / "Si puedes, alquila en otro lado" / "Te estoy siendo honesto: no lo recomiendo". CRÉELES. No tienen razón para mentir.',
        },
        {
          type: ContentType.P,
          text: '🚨 Múltiples problemas serios: "Nunca respondía, retuvo mi depósito injustamente, y la propiedad tenía problemas que nunca arregló."',
        },
        {
          type: ContentType.P,
          text: '🚨 Estancia muy corta: "Me fui a los 3 meses, no aguanté más." Si alguien rompe contrato temprano, generalmente es por razones graves.',
        },
        {
          type: ContentType.P,
          text: '🚨 Problemas legales: "Tuve que demandarlo para recuperar mi depósito" / "Tuvimos que llamar a inspección municipal porque no arreglaba problemas de seguridad". Propietario que llega a tribunales con inquilinos = RED FLAG MASIVA.',
        },
        {
          type: ContentType.P,
          text: '🚨 Tono emocional negativo: Enojo, frustración, o tristeza al recordar la experiencia. "Ufff, no me hagas recordar..." / "Fue la peor experiencia de alquiler de mi vida."',
        },
        {
          type: ContentType.P,
          text: '🚨 Múltiples referencias dicen lo mismo: Si 2-3 inquilinos diferentes mencionan los mismos problemas independientemente: ES UN PATRÓN CONFIRMADO. EVITA ESE PROPIETARIO.',
        },
      ],
      // Verificación Cruzada
      [
        { type: ContentType.H2, text: 'Verificación Cruzada' },
        { type: ContentType.H3, text: 'No te fíes de una sola fuente' },
        {
          type: ContentType.P,
          text: 'Reúne información de: 1. Mínimo 2 inquilinos anteriores, 2. Vecinos actuales, 3. Administración del edificio (si aplica), 4. Reseñas online, 5. Tu propia observación del propietario.',
        },
        {
          type: ContentType.P,
          text: 'Busca: Consistencia (¿Todos dicen cosas similares?), Patrones (¿Problemas que se repiten?), Contradicciones (Si una referencia es muy positiva y otra muy negativa, investiga más).',
        },
        { type: ContentType.H3, text: 'Caso especial: Referencias sospechosamente perfectas' },
        {
          type: ContentType.P,
          text: 'Si TODAS las referencias son extremadamente positivas sin un solo defecto: "Es perfecto, nunca tuve un solo problema, 10/10 en todo."',
        },
        {
          type: ContentType.P,
          text: 'Puede ser: ✅ Propietario genuinamente excelente (posible pero raro) o 🚨 Referencias falsas (amigos/familiares del propietario).',
        },
        {
          type: ContentType.P,
          text: 'Cómo verificar: ¿Las referencias comparten apellido con el propietario? ¿Pueden dar ejemplos específicos o solo generalidades? ¿Suenan espontáneos o ensayados? ¿Contestan tus preguntas directamente o evaden?',
        },
        {
          type: ContentType.P,
          text: 'Si sospechas referencias falsas: Busca referencias alternativas por tu cuenta (vecinos, online, etc.).',
        },
      ],
      // Qué Hacer con la Información
      [
        { type: ContentType.H2, text: 'Qué Hacer con la Información' },
        { type: ContentType.H3, text: 'Si las referencias son muy positivas' },
        {
          type: ContentType.P,
          text: '✅ Procede con confianza: Aún así, haz tu debida diligencia completa (inspección, contrato, etc.), pero sabes que tienes un propietario confiable. Puedes negociar con más tranquilidad.',
        },
        { type: ContentType.H3, text: 'Si hay señales amarillas menores' },
        {
          type: ContentType.P,
          text: '⚠️ Evalúa si son tolerables: ¿Son cosas con las que puedes vivir? ¿Puedes mitigarlas? (ej: si tarda en responder, ten todo por escrito). ¿Los pros superan los contras?',
        },
        {
          type: ContentType.P,
          text: '⚠️ Pregunta al propietario sobre lo que te dijeron: "Hablé con el inquilino anterior que mencionó [problema]. ¿Qué pasó ahí? ¿Se ha solucionado?" Su respuesta te dirá mucho: si es honesto y reconoce, positivo; si se pone defensivo o niega, red flag.',
        },
        {
          type: ContentType.P,
          text: '⚠️ Agrega protecciones específicas al contrato basándote en lo que descubriste.',
        },
        { type: ContentType.H3, text: 'Si hay múltiples señales rojas' },
        {
          type: ContentType.P,
          text: '🚨 Considera seriamente buscar otra opción. No ignores advertencias claras de múltiples fuentes.',
        },
        {
          type: ContentType.P,
          text: 'Preguntas que debes hacerte: ¿Realmente quiero firmar un contrato de 12 meses con alguien que múltiples personas me advirtieron que es problemático? ¿El precio bajo o la ubicación conveniente vale la pena el estrés probable? ¿Hay alternativas razonables?',
        },
        {
          type: ContentType.P,
          text: 'Recuerda: Un mal propietario puede convertir la propiedad más linda en una pesadilla. Un buen propietario puede hacer que una propiedad promedio sea un excelente hogar.',
        },
      ],
      // Si el Propietario Se Niega
      [
        { type: ContentType.H2, text: 'Si el Propietario Se Niega a Dar Referencias' },
        { type: ContentType.H3, text: 'Es tu derecho como consumidor' },
        {
          type: ContentType.P,
          text: 'Pedir referencias es estándar en transacciones de confianza: Empleadores las piden, universidades las piden, bancos las piden para préstamos. Inquilinos tienen derecho a pedirlas también.',
        },
        { type: ContentType.H3, text: 'Qué hacer si se niega' },
        {
          type: ContentType.P,
          text: '1. Explica por qué es importante para ti: "Entiendo que puede parecer inusual, pero para mí es importante tomar una decisión informada. Estoy comprometiéndome a un contrato de [X meses] y quiero asegurarme de que será una buena relación para ambos."',
        },
        {
          type: ContentType.P,
          text: '2. Ofrece alternativas: "Si no puedes dar contactos de inquilinos por privacidad, ¿podrías pedirles tú que me contacten a mí si están dispuestos?" / "¿Hay alguna forma de verificar tu historial como propietario?"',
        },
        {
          type: ContentType.P,
          text: '3. Busca referencias por tu cuenta: Habla con vecinos, busca online, consulta administración del edificio.',
        },
        {
          type: ContentType.P,
          text: '4. Evalúa seriamente si quieres proceder: Si el propietario se niega rotundamente y no puedes encontrar referencias alternativas, pregúntate: ¿Por qué se niega si no tiene nada que ocultar? Puede ser legítimo respeto a privacidad, o puede ser que sabe que las referencias serían negativas. Tu decisión: ¿Estás dispuesto a tomar el riesgo?',
        },
      ],
      // Sé Tú una Buena Referencia
      [
        { type: ContentType.H2, text: 'Sé Tú una Buena Referencia Futura' },
        { type: ContentType.H3, text: 'Paga el favor hacia adelante' },
        { type: ContentType.P, text: 'Cuando tú seas el inquilino anterior:' },
        { type: ContentType.P, text: '✓ Si tu experiencia fue buena, compártela honestamente' },
        {
          type: ContentType.P,
          text: '✓ Si fue mala, también sé honesto - podrías salvar a alguien de tu misma experiencia',
        },
        { type: ContentType.P, text: '✓ Sé específico y justo, no exageres' },
        { type: ContentType.P, text: '✓ Responde a futuros inquilinos que te contacten' },
        {
          type: ContentType.P,
          text: 'Es un círculo virtuoso: Tú te beneficiaste de referencias honestas. Otros merecen lo mismo.',
        },
      ],
      // Conclusión
      [
        { type: ContentType.H2, text: 'Conclusión' },
        {
          type: ContentType.P,
          text: 'Solicitar y verificar referencias es uno de los pasos más valiosos que puedes tomar antes de firmar un contrato de alquiler. Te da acceso a información que nunca obtendrías de otra forma y puede: salvarte de un propietario problemático, confirmar que estás tomando una excelente decisión, revelarte problemas ocultos de la propiedad, darte paz mental antes de comprometerte.',
        },
        { type: ContentType.P, text: 'Reglas de oro:' },
        {
          type: ContentType.OL,
          children: [
            {
              type: ContentType.LI,
              text: 'Siempre pide al menos 2-3 referencias de inquilinos anteriores',
            },
            {
              type: ContentType.LI,
              text: 'El inquilino inmediatamente anterior es la referencia más valiosa',
            },
            {
              type: ContentType.LI,
              text: 'Haz las 15 preguntas críticas, especialmente "¿Volverías a alquilar con este propietario?"',
            },
            { type: ContentType.LI, text: 'Busca patrones en múltiples referencias' },
            { type: ContentType.LI, text: 'No ignores advertencias directas - créeles' },
            {
              type: ContentType.LI,
              text: 'Si el propietario se niega a dar referencias sin razón válida, es RED FLAG',
            },
            {
              type: ContentType.LI,
              text: 'Verifica cruzadamente con vecinos, online, y administración',
            },
            {
              type: ContentType.LI,
              text: 'Usa la información para negociar protecciones en el contrato',
            },
            { type: ContentType.LI, text: 'Referencias muy negativas = busca otra propiedad' },
            {
              type: ContentType.LI,
              text: 'Paga el favor hacia adelante siendo tú una referencia honesta',
            },
          ],
        },
        {
          type: ContentType.P,
          text: 'Un propietario profesional y honesto no tendrá problema en que hables con sus inquilinos anteriores. Uno problemático inventará excusas para evitarlo.',
        },
        {
          type: ContentType.P,
          text: '15-20 minutos hablando con inquilinos anteriores pueden ahorrarte 12 meses de miseria y miles de dólares en problemas.',
        },
        {
          type: ContentType.P,
          text: 'No tengas vergüenza de pedir referencias. Es tu derecho, es profesional, y es inteligente.',
        },
        {
          type: ContentType.P,
          text: 'La mejor inversión que puedes hacer antes de firmar un contrato de alquiler es conocer la experiencia real de quienes ya pasaron por lo mismo que tú estás considerando.',
        },
        { type: ContentType.P, text: 'Pregunta. Verifica. Decide informadamente.' },
      ],
    ],
  },
];
