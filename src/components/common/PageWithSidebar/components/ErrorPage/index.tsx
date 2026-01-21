import { Card, CardContent } from '@/components/ui/card';
import { type IErrorPageProps } from './types';
import { Button } from '@/components/ui/button';

/**
 * ErrorPage component
 *
 * Renders an error page with a title and optional subtitle.
 * This component is responsible for displaying an error page.
 */
export const ErrorPage = ({ title, subTitle }: IErrorPageProps) => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">{title}</p>
          <p className="text-gray-400 mb-4">{subTitle}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Volver atrás
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
