import { TermsAndConditionsComponent } from '@/components/features';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Términos y Condiciones | ReviUy',
  description: 'Lee los términos y condiciones de uso de la plataforma ReviUy.',
  path: '/terminos',
});

export default function TerminosPage() {
  return <TermsAndConditionsComponent />;
}
