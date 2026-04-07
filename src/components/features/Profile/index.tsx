'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfileComponent } from './hooks';
import { FavoriteRealEstates, FavoriteReviews, MyReviews } from './components';
import { DeleteAccountSection } from './components/DeleteAccountSection';
import { PageWithSidebar } from '@/components/common';

export const ProfileComponent = () => {
  const {
    reviews,
    loadingReviews,
    error,
    refetch,
    favorites,
    loadingFavorites,
    favoriteReviews,
    loadingFavoriteReviews,
    activeTab,
    setActiveTab,
  } = useProfileComponent();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <PageWithSidebar
        isError={Boolean(error)}
        errorTitle="Hubo un problema al cargar tu perfil"
        errorSubTitle=""
        authIsRequired={true}
        title="Mi perfil"
        description="Gestiona tus reseñas y favoritos"
        sidebar={
          <div className="h-24 lg:h-72">
            <h3 className="font-bold text-foreground mb-6">Categorías</h3>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-1 gap-2">
              <TabsTrigger value="reviews" className="flex justify-center">
                Mis reseñas
              </TabsTrigger>
              <TabsTrigger value="favoriteReviews" className="flex justify-center">
                Favoritas
              </TabsTrigger>
              <TabsTrigger value="favoriteRealEstates" className="flex justify-center">
                Inmobiliarias
              </TabsTrigger>
              <TabsTrigger value="config" className="flex justify-center">
                Configuración
              </TabsTrigger>
            </TabsList>
          </div>
        }
      >
        <div className="mx-auto w-full flex flex-col gap-8">
          <TabsContent value="reviews">
            <MyReviews refetch={refetch} reviews={reviews} isLoading={loadingReviews} />
          </TabsContent>

          <TabsContent value="favoriteReviews">
            <FavoriteReviews
              loadingFavoriteReviews={loadingFavoriteReviews}
              favoriteReviews={favoriteReviews}
            />
          </TabsContent>

          <TabsContent value="favoriteRealEstates">
            <FavoriteRealEstates favorites={favorites} loadingFavorites={loadingFavorites} />
          </TabsContent>

          <TabsContent value="config">
            <section>
              <DeleteAccountSection />
            </section>
          </TabsContent>
        </div>
      </PageWithSidebar>
    </Tabs>
  );
};
