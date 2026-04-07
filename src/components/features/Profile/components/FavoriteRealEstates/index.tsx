'use client';

import { FavoriteRealEstateButton } from '@/components/common';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PagesUrls } from '@/enums';
import { Search, Building2 } from 'lucide-react';
import { EmptySection } from '../EmptySection';
import { SkeletonSection } from '../SkeletonSection';
import { Button } from '@/components/ui/button';
import { GetCurrentUserFavoriteRealEstatesOutput } from '@/modules/profiles';
import { ProfileSectionList } from '../ProfileSectionList';
import { useRouter } from 'next/navigation';

export interface FavoriteRealEstatesProps {
  favorites: GetCurrentUserFavoriteRealEstatesOutput;
  loadingFavorites: boolean;
}
export const FavoriteRealEstates = (props: FavoriteRealEstatesProps) => {
  const { favorites, loadingFavorites } = props;
  const router = useRouter();

  if (loadingFavorites) {
    return <SkeletonSection />;
  }

  if (!favorites || favorites.length === 0) {
    return (
      <EmptySection
        title="No tienes inmobiliarias en favoritos"
        link={PagesUrls.REAL_ESTATE}
        icon={Search}
        description="Explorar inmobiliarias"
      />
    );
  }
  return (
    <ProfileSectionList title="Inmobiliarias favoritas">
      {favorites.map((realEstate) => (
        <Card
          key={realEstate.id}
          className="min-w-80 flex flex-col overflow-hidden transition-shadow hover:shadow-md group"
        >
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
    </ProfileSectionList>
  );
};
