'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { useGetAllRealEstates } from '@/services';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';
import { FavoriteRealEstateButton } from '@/components/common';

export const LatestRealEstates = () => {
  const { data: realEstates, isLoading, error } = useGetAllRealEstates({ limit: 6 });

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Últimas Inmobiliarias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Últimas Inmobiliarias
        </h3>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">{error.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (realEstates?.length === 0) {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Últimas Inmobiliarias
        </h3>
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay inmobiliarias registradas aún</p>
            <Button onClick={() => redirect(PagesUrls.REAL_ESTATE_CREATE)} variant="outline">
              Agregar primera inmobiliaria
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        Últimas Inmobiliarias
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {realEstates?.map((realEstate) => (
          <Card key={realEstate.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-start justify-between">
                <div
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => redirect(`${PagesUrls.REAL_ESTATE}${realEstate.id}`)}
                >
                  <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{realEstate.name}</span>
                </div>
                <FavoriteRealEstateButton realEstateId={realEstate.id} />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
