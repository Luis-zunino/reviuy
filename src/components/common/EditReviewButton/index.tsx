'use client';

import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { EditReviewButtonProps } from './types';

export const EditReviewButton = (props: EditReviewButtonProps) => {
  const { review, showText = false, variant = 'ghost', size = 'sm' } = props;
  const router = useRouter();

  if (!review.is_mine) {
    return null;
  }

  const handleEdit = () => {
    router.push(PagesUrls.EDIT_REVIEW.replace(':id', String(review.id)));
  };

  return (
    <Button
      onClick={handleEdit}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
      title="Editar reseña"
      variant={variant}
      size={size}
      icon={PencilIcon}
    >
      {showText ? <span className="hidden sm:inline">Editar</span> : null}
    </Button>
  );
};
