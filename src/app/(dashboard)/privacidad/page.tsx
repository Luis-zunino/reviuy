import { PrivacyPolicyComponent } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad | ReviUy',
  description: 'Conoce nuestra política de privacidad y protección de datos.',
};

export default function PrivacidadPage() {
  return <PrivacyPolicyComponent />;
}
