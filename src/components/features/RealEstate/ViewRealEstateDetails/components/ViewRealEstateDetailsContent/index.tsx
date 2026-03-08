import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import { RealEstateReviewWithVotesPublic, ReviewWithVotesPublic } from '@/types';
import { RealEstateReviewTabContent, RealEstateUserExperienceTabContent } from './components';

export interface ViewRealEstateDetailsContentProps {
  reviews: ReviewWithVotesPublic[];
  realEstateReview?: RealEstateReviewWithVotesPublic[] | null;
  isLoadingReviews: boolean;
  realEstateId: string;
}
export const ViewRealEstateDetailsContent = (props: ViewRealEstateDetailsContentProps) => {
  const { reviews, realEstateReview, isLoadingReviews, realEstateId } = props;
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

      <RealEstateReviewTabContent realEstateReview={realEstateReview} realEstateId={realEstateId} />
      <RealEstateUserExperienceTabContent reviews={reviews} isLoadingReviews={isLoadingReviews} />
    </Tabs>
  );
};
