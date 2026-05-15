import { ViewRealEstateDetails } from '@/components/features/RealEstate/ViewRealEstateDetails/index';
import { generatePageMetadata } from '@/lib/metadata';

interface RealEstateDetailsPageProps {
  params: Promise<{ realEstateId: string }>;
}

export async function generateMetadata({ params }: RealEstateDetailsPageProps) {
  const { realEstateId } = await params;

  return generatePageMetadata({
    title: 'Detalle de inmobiliaria | ReviUy',
    description: 'Consulta reseñas, votos y experiencias de alquiler para esta inmobiliaria.',
    path: `/real-estate/${realEstateId}`,
  });
}

export default async function RealEstateDetailsPage({ params }: RealEstateDetailsPageProps) {
  const { realEstateId } = await params;

  return <ViewRealEstateDetails realEstateId={realEstateId} />;
}
