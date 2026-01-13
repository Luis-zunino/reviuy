import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { RealEstateReview, Review } from '@/types';
import { RealEstateReviewTabContent, RealEstateUserExperienceTabContent } from './components';

export interface ViewRealEstateDetailsContentProps {
  reviews: Review[];
  realEstateReview?: RealEstateReview[] | null;
  isLoadingReviews: boolean;
  realEstateId: string;
  userId: string;
}
export const ViewRealEstateDetailsContent = (props: ViewRealEstateDetailsContentProps) => {
  const { reviews, realEstateReview, isLoadingReviews, realEstateId, userId } = props;
  const [activeTab, setActiveTab] = useState('realEstateReview');
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="realEstateReview" className="flex md:items-center gap-2">
          <MessageSquare className="h-4 w-4 hidden md:block" />
          Reseñas de usuarios
        </TabsTrigger>
        <TabsTrigger value="realEstateUserExperience" className="flex md:items-center gap-2">
          <MessageSquare className="h-4 w-4 hidden md:block" />
          Experiencias en alquileres
        </TabsTrigger>
      </TabsList>

      <RealEstateReviewTabContent
        realEstateReview={realEstateReview}
        realEstateId={realEstateId}
        userId={userId}
      />
      <RealEstateUserExperienceTabContent reviews={reviews} isLoadingReviews={isLoadingReviews} />
    </Tabs>
  );
};
