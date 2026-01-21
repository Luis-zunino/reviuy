'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteReviewDialog } from '@/components/common';
import { useDeleteReview } from '@/services/apis/reviews';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { DeleteReviewButtonProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const DeleteReviewButton: React.FC<DeleteReviewButtonProps> = ({
  review,
  onDeleteSuccess,
  showText = false,
  variant = 'ghost',
  size = 'sm',
  className = '',
}) => {
  const route = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isOwner } = useAuthContext();

  const { mutateAsync, isPending } = useDeleteReview({
    onSuccess: () => {
      setShowDeleteDialog(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      route.push(PagesUrls.HOME);
    },
  });

  // Si no es el propietario o no hay user_id, no mostrar el componente
  if (!isOwner(review.user_id) || !review.user_id) {
    return null;
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    mutateAsync(review.id);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleDeleteClick}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
        disabled={isPending}
        icon={Trash2}
        iconPosition="left"
        title="Eliminar"
      >
        {showText && <span className="hidden sm:inline ml-2">Eliminar</span>}
      </Button>

      <DeleteReviewDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        reviewTitle={review.title}
        isDeleting={isPending}
      />
    </>
  );
};
