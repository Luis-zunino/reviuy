'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';

export const CreateReview = () => {
  const router = useRouter();
  return (
    <div className="rounded-[40px] overflow-hidden min-h-[388px]">
      <div className="relative min-h-[180px]">
        <Image
          alt="Imagen"
          loading="lazy"
          className="object-cover"
          sizes="100%"
          src="https://placehold.co/600x400"
          fill
        />
      </div>
      <div className="text-center flex justify-center items-center lg:items-start flex-col lg:text-left lg:order-first order-last p-8 lg:py-20 lg:pl-[59px] lg:pr-[62px] bg-primary-100 overflow-hidden">
        <p className="text-xs text-primary-500 uppercase font-bold mb-1">
          Revive tu experiencia y compártela
        </p>
        <h4 className="text-primary-500 lg:text-4xl lg:font-extrabold mt-1 xs:text-2xl">
          Ayuda a otros a encontrar su piso ideal
        </h4>
        <Button
          className="btn btn-primary-500 mt-10 content-center overflow-hidden whitespace-nowrap"
          title="Crea una nueva opinión en Reviu"
          onClick={() => {
            router.push(PagesUrls.REVIEW_CREATE);
          }}
        >
          Escribe una opinión
        </Button>
      </div>
      <div className="relative min-h-[180px]">
        <Image
          alt="Imagen"
          loading="lazy"
          className="object-cover"
          sizes="100%"
          src="https://placehold.co/600x400"
          fill
        />
      </div>
    </div>
  );
};
