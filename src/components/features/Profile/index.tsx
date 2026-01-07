'use client';

import { FavoriteRealEstateButton, Header, ReviewCard } from '@/components/common';
import { useUserReviews } from '@/hooks';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  RefreshCw,
  Plus,
  Heart,
  MessageSquare,
  Building2,
  Star,
  LogOut,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import Link from 'next/link';
import { useGetUserFavoriteRealEstates, useGetUserFavoriteReviews } from '@/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const ProfileComponent = () => {
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { reviews, loading, error, refetch } = useUserReviews();
  const { data: favorites, isLoading: loadingFavorites } = useGetUserFavoriteRealEstates();
  const { data: favoriteReviews, isLoading: loadingFavoriteReviews } = useGetUserFavoriteReviews();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reviews');

  if (!isAuthenticated || !user) {
    return (
      <div className=" mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Perfil de Usuario
            </CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={PagesUrls.LOGIN} className="w-full">
              Crear cuenta / Iniciar sesión
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto p-6">
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Hubo un problema al cargar tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6">
      <Header title="Mi Perfil" />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Button
              onClick={() => router.push(PagesUrls.REVIEW_CREATE)}
              className="flex items-center gap-2"
              icon={Plus}
            >
              Crear reseña
            </Button>
            <Button
              onClick={() => {
                void signOut();
              }}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              icon={LogOut}
            >
              Cerrar sesión
            </Button>
          </CardTitle>
          <CardDescription>Usuario: {user.email}</CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs para Reseñas y Favoritos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-8">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 gap-2">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Mis Reseñas ({reviews.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="favoriteReviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reseñas Favoritas ({favoriteReviews?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="favoriteRealEstates" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Inmobiliarias ({favorites?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab de Reseñas */}
        <TabsContent value="reviews" className="mt-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Mis reseñas publicadas</h2>
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden md:flex">Actualizar</span>
              </Button>
            </div>

            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600 mb-4">No has publicado ninguna reseña aún.</p>
                  <Link href={PagesUrls.REVIEW_CREATE} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Crear tu primera reseña
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        {/* Tab de Reseñas Favoritas */}
        <TabsContent value="favoriteReviews" className="mt-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reseñas favoritas</h2>
            </div>

            {loadingFavoriteReviews ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !favoriteReviews || favoriteReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes reseñas en favoritos</p>
                  <Link href={PagesUrls.HOME} className="flex items-center gap-2">
                    <Search />
                    Explorar reseñas
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteReviews.map((review) => (
                  <div key={review.id}>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        {/* Tab de Inmobiliarias Favoritas */}
        <TabsContent value="favoriteRealEstates" className="mt-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Inmobiliarias favoritas</h2>
            </div>

            {loadingFavorites ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !favorites || favorites.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes inmobiliarias en favoritos</p>
                  <Link href={PagesUrls.HOME} className="flex items-center gap-2">
                    <Search />
                    Explorar inmobiliarias
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((realEstate) => (
                  <Card key={realEstate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          {realEstate.name}
                        </CardTitle>
                        <FavoriteRealEstateButton realEstateId={realEstate.id} />
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
      </Tabs>
    </div>
  );
};
