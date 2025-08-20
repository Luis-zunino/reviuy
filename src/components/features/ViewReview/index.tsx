'use client';

import React from 'react';
import { ReviewSidebar, ReviewSummary } from './components';
import { useViewReview } from './hooks';
import { PagesUrls } from '@/enums';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/common';

export const ViewReview = (props: { id: string }) => {
  const { id } = props;
  const { data } = useViewReview({ id });
  const router = useRouter();
  return (
    <div className="m-6 lg:m-16 rounded-lg bg-white">
      <div className="flex justify-start mb-3 px-6 pt-6 lg:px-16 lg:pt-16">
        <BackButton handleOnClick={() => router.push(PagesUrls.HOME)} />
        <h4 className="font-bold lg:block hidden ">
          <span className="">{data.address.fullAddress}</span>
        </h4>
      </div>
      <div className="pb-20 md:pb-0 px-6 lg:px-16">
        <div className="bg-white grid lg:grid-cols-[auto_1fr] grid-col border-b-2 mb-10 md:gap-10 gap-5">
          <div className="lg:hidden flex-1  top-0 h-14  bg-white justify-start flex items-center ">
            <h6 className="font-bold">Detalle opinión</h6>
          </div>
          <ReviewSidebar />
          <ReviewSummary />
        </div>
      </div>
    </div>
  );
};
