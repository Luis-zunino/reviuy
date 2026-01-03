'use client';
import { ReviewSidebar, ReviewSummary } from './components';
import { useViewReview } from './hooks';
import { Loading, ErrorPage, BackButton } from '@/components/common';

export const ViewReview = () => {
  const { data, isLoading, error } = useViewReview();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 lg:py-16 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-xl bg-card shadow-sm p-8 lg:p-16">
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 lg:py-16 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-xl bg-card shadow-sm p-8 lg:p-16">
          <ErrorPage
            title="Error al cargar la reseña"
            subTitle="No se pudo cargar la información de la reseña. Por favor, intenta de nuevo."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4 lg:py-12 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 lg:mb-10">
          <div className="flex items-start gap-4 mb-6">
            <BackButton />

            <div className="hidden lg:flex flex-1 min-w-0">
              <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight text-balance">
                {data?.address_text}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-10">
          <aside className="lg:order-1">
            <ReviewSidebar review={data} />
          </aside>
          <main className="lg:order-2">
            <ReviewSummary review={data} />
          </main>
        </div>
      </div>
    </div>
  );
};
