'use client';

import { ViewAddressReviews } from '@/components/features/Review/ViewAddressReviews';
import { useParams } from 'next/navigation';
import React from 'react';

const Address = () => {
  const { osmId } = useParams<{ osmId: string }>();

  return <ViewAddressReviews osmId={osmId} />;
};

export default Address;
