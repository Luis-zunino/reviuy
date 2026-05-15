import { PrivacyPolicyComponent } from '@/components/features';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Política de privacidad | ReviUy',
  description: 'Conoce nuestra política de privacidad y protección de datos.',
  path: '/privacidad',
});

export default function PrivacidadPage() {
  return <PrivacyPolicyComponent />;
}
