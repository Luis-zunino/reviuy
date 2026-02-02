'use client';

import { FavoriteRealEstateButton, PageWithSidebar, ReviewCard } from '@/components/common';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Plus, Building2, Search } from 'lucide-react';
import { PagesUrls } from '@/enums';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfileComponent } from './hooks';
import { EmptySection, SkeletonSection } from './components';

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
    router,
    activeTab,
    setActiveTab,
  } = useProfileComponent();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <PageWithSidebar
        isLoading={loadingReviews}
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
            </TabsList>
          </div>
        }
      >
        <div className="mx-auto w-full flex flex-col gap-8">
          <TabsContent value="reviews">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Mis reseñas publicadas</h2>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden md:flex">Actualizar</span>
                </Button>
              </div>

              {reviews?.length === 0 ? (
                <EmptySection
                  title="No has publicado ninguna reseña aún."
                  link={PagesUrls.REVIEW_CREATE}
                  icon={Plus}
                  description="Crear tu primera reseña"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {reviews?.map((review) => (
                    <ReviewCard review={review} key={review.id} />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="favoriteReviews">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Reseñas favoritas</h2>
              </div>

              {loadingFavoriteReviews ? (
                <SkeletonSection />
              ) : !favoriteReviews || favoriteReviews.length === 0 ? (
                <EmptySection
                  title="No tienes reseñas en favoritos"
                  link={PagesUrls.HOME}
                  icon={Search}
                  description="Explorar reseñas"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {favoriteReviews.map((review) => (
                    <div key={review.id}>
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="favoriteRealEstates">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Inmobiliarias favoritas</h2>
              </div>

              {loadingFavorites ? (
                <SkeletonSection />
              ) : !favorites || favorites.length === 0 ? (
                <EmptySection
                  title="No tienes inmobiliarias en favoritos"
                  link={PagesUrls.REAL_ESTATE}
                  icon={Search}
                  description="Explorar inmobiliarias"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {favorites.map((realEstate) => (
                    <Card key={realEstate.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            {realEstate.name}
                          </CardTitle>
                          <FavoriteRealEstateButton realEstateId={realEstate.id ?? ''} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="pt-2">
                          <Button
                            onClick={() => router.push(`${PagesUrls.REAL_ESTATE}${realEstate.id}`)}
                            className="w-full"
                            variant="outline"
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </div>
      </PageWithSidebar>
    </Tabs>
  );
};
