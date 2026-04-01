import { FAQComponent } from '@/components/features/FAQ';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Preguntas frecuentes | ReviUy',
  description: 'Encuentra respuestas a las preguntas más comunes sobre ReviUy.',
  path: '/faq',
});

export default function FAQPage() {
  return <FAQComponent />;
}
