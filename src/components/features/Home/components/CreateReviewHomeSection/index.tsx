'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import { Decoration } from '@/components/ui/Decoration';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const CreateReviewHomeSection = () => {
  const { isAuthenticated } = useAuthContext();
  const { push } = useRouter();
  return (
    <div className="min-h-160 relative">
      <Decoration className="min-h-160 w-screen opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4 lg:py-10 lg:px-16 bg-primary-100/90 backdrop-blur-xs rounded-2xl shadow-lg mx-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            ¿Querés compartir tu experiencia?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Ayudá a otros inquilinos compartiendo tu opinión sobre tu departamento
          </p>
          <div className="flex justify-center">
            <Button
              title="Crea una nueva opinión en Reviu"
              onClick={() => {
                return isAuthenticated ? push(PagesUrls.REVIEW_CREATE) : push(PagesUrls.LOGIN);
              }}
              variant="outline"
              className="px-8 py-3"
            >
              Escribe una opinión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
