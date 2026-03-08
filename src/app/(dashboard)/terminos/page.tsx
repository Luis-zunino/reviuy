import { TermsAndConditionsComponent } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | ReviUy',
  description: 'Lee los términos y condiciones de uso de la plataforma ReviUy.',
};

export default function TerminosPage() {
  return <TermsAndConditionsComponent />;
}
