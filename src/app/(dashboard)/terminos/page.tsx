import { TermsAndConditionsComponent } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Reviuy',
  description: 'Lee los términos y condiciones de uso de la plataforma Reviuy.',
};

export default function TerminosPage() {
  return <TermsAndConditionsComponent />;
}
