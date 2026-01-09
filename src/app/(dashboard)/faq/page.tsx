import { FAQComponent } from '@/components/features/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes | Reviuy',
  description: 'Encuentra respuestas a las preguntas más comunes sobre Reviuy.',
};

export default function FAQPage() {
  return <FAQComponent />;
}
