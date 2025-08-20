'use client';

import { TipComponent } from '@/components/features/Tip';
import { useParams } from 'next/navigation';
import React from 'react';

const Tip = () => {
  const { id } = useParams<{ id: string }>();
  return <TipComponent id={Number(id)} />;
};

export default Tip;
