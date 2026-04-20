import { ViewAddressReviews } from '@/components/features/Review/ViewAddressReviews';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { NominatimAddressReadRepository } from '@/modules/addresses/infrastructure';

interface AddressPageProps {
  params: Promise<{ osmId: string }>;
}

const addressRepository = new NominatimAddressReadRepository();

export async function generateMetadata({ params }: AddressPageProps): Promise<Metadata> {
  const { osmId } = await params;

  try {
    const [addressInfo] = await addressRepository.getAddressInfo({ osmId });
    const displayName = addressInfo?.display_name?.trim();

    if (displayName) {
      return generatePageMetadata({
        title: `${displayName} | Opiniones y referencias de alquiler`,
        description: `Lee opiniones y referencias reales sobre ${displayName}. Revisa reseñas de inquilinos, calificaciones y experiencias en ReviUy.`,
        path: `/address/${osmId}`,
        keywords: [
          displayName,
          `${displayName} opiniones`,
          `${displayName} referencias`,
          `${displayName} reseñas`,
          'opiniones de dirección',
          'referencias de alquiler',
        ],
      });
    }
  } catch {
    // Fallback silencioso para no bloquear metadata si Nominatim no responde.
  }

  return generatePageMetadata({
    title: 'Reseñas, opiniones y referencias por dirección | ReviUy',
    description:
      'Encuentra reseñas, opiniones y referencias de alquiler por dirección en Uruguay. Compara experiencias antes de decidir.',
    path: `/address/${osmId}`,
    keywords: [
      'opiniones por dirección',
      'referencias por dirección',
      'reseñas de alquiler uruguay',
    ],
  });
}

const Address = () => {
  return <ViewAddressReviews />;
};

export default Address;
