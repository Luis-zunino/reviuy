'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PageWithSidebar } from '@/components/common';

export const NoAuthenticated = () => {
  const router = useRouter();
  return (
    <PageWithSidebar
      title="Acceso requerido"
      description="Debes iniciar sesión para poder acceder a este contenido"
    >
      <div className="container md:mx-auto py-10 flex flex-1 flex-col items-center justify-cente min-h-[80vh]">
        <Card className="w-full mx-auto">
          <CardContent>
            <div className=" space-y-2 flex gap-2 justify-center">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Iniciar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWithSidebar>
  );
};
