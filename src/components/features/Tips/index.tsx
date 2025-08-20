'use client';

import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { tips } from '@/services/mocks/tips.mock';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const TipsComponent = () => {
  const router = useRouter();
  return (
    <div className="lg:px-16 px-4 pt-10 pb-20 ">
      <h3>Consejos a la hora de alquilar</h3>
      <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1 lg:pt-10 pt-4">
        <div className="w-full">
          <div className="space-y-6 sm:max-w-3xl lg:max-w-4xl">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="grid grid-cols-1 sm:grid-cols-12 bg-white rounded-2xl shadow-sm overflow-hidden md:max-h-64  opacity-100"
              >
                <div className="sm:col-span-3 lg:col-span-4 bg-blue-200 max-h-52 sm:max-h-none">
                  <Image
                    alt="Imagen"
                    loading="lazy"
                    width="600"
                    height="600"
                    decoding="async"
                    className="object-cover h-full"
                    src={tip.img}
                  />
                </div>
                <div className="sm:col-span-9 lg:col-span-8 p-6 ">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{tip.title}</h2>
                  <section aria-labelledby="information-heading" className="mt-3 ">
                    <h3 id="information-heading" className="sr-only">
                      {tip.content}
                    </h3>
                  </section>
                  <section aria-labelledby="options-heading" className="mt-6 text-start">
                    <Button onClick={() => router.push(`${PagesUrls.TIPS}/${tip.id}`)}>
                      Ver más
                    </Button>
                  </section>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
