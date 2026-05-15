import { GoodPracticesComponent } from '@/components/features';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Buenas prácticas | ReviUy',
  description: 'Guía de buenas prácticas para la comunidad de ReviUy.',
  path: '/good-practices',
});

export default function GoodPracticesPage() {
  return <GoodPracticesComponent />;
}
