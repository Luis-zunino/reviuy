import { FAQComponent } from '@/components/features/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes | ReviUy',
  description: 'Encuentra respuestas a las preguntas más comunes sobre ReviUy.',
};

export default function FAQPage() {
  return <FAQComponent />;
}
