'use client';

import { ViewReview } from '@/components/features/ViewReview';
import { useParams } from 'next/navigation';
import React from 'react';

const ReviewDetails = () => {
  const { id } = useParams<{ id: string }>();

  return <ViewReview id={id} />;
};

export default ReviewDetails;
