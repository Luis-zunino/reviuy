import { TipComponent } from '@/components/features/Tip';
import { generatePageMetadata } from '@/lib/metadata';

interface TipPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TipPageProps) {
  const { id } = await params;

  return generatePageMetadata({
    title: 'Tip inmobiliario | ReviUy',
    description: 'Consejos prácticos para alquilar y evaluar propiedades en Uruguay.',
    path: `/tips/${id}`,
  });
}

const Tip = () => {
  return <TipComponent />;
};

export default Tip;
