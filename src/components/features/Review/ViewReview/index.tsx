'use client';
import { PagesUrls } from '@/enums';
import { ReviewSidebar, ReviewSummary } from './components';
import { useViewReview } from './hooks';
import { PageWithSidebar } from '@/components/common';

export const ViewReview = () => {
  const { data, isLoading, error } = useViewReview();

  return (
    <PageWithSidebar
      isLoading={isLoading}
      isError={Boolean(error) || !data}
      errorTitle="Error al cargar la reseña"
      errorSubTitle="No se pudo cargar la información de la reseña. Por favor, intenta de nuevo."
      title="Detalles de la reseña"
      description={data?.address_text ?? ''}
      breadcrumbItems={[
        {
          label: 'Reseñas',
          href: PagesUrls.ADDRESS_DETAILS.replace(':osmId', data?.address_osm_id ?? ''),
        },
        { label: 'Detalles de la reseña' },
      ]}
    >
      <div className="min-h-screen bg-background py-6 px-4 lg:py-12 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-10">
          <aside className="lg:order-1">{data ? <ReviewSidebar review={data} /> : null}</aside>
          <main className="lg:order-2">{data ? <ReviewSummary review={data} /> : null}</main>
        </div>
      </div>
    </PageWithSidebar>
  );
};
