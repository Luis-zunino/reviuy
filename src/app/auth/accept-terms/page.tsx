import { generatePageMetadata } from '@/lib/metadata';
import { AcceptTerms } from '@/components/features/AcceptTerms';

export const metadata = generatePageMetadata({
  title: 'Aceptar Términos | ReviUy',
  description: 'Acepta los términos y condiciones para continuar usando ReviUy.',
  path: '/auth/accept-terms',
  noIndex: true,
});

const AcceptTermsPage = () => {
  return (
    <div className="min-h-screen bg-fog dark:bg-reviuy-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-reviuy-gray-200/70 dark:border-reviuy-gray-700 bg-canvas-white dark:bg-reviuy-gray-800 p-8">
          <AcceptTerms />
        </div>
      </div>
    </div>
  );
};

export default AcceptTermsPage;
