import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tips, Doubts, LatestReviews, Filters, CreateReview } from './components';

export const Home = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="lg:border-r flex flex-col">
        <CardHeader className="p-4 lg:p-6 border-b text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center text-center mx-auto">
            <MapPin className="h-6 w-6 mr-3 text-blue-600" />
            <h1 className="text-center">Explora y comparte tus experiencias.</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1">
          <Filters />
          <LatestReviews />
        </CardContent>
      </Card>
      <Tips />
      <Doubts />
      <CreateReview />
    </div>
  );
};
