'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteReviewDialog } from '@/components/common';
import type { DeleteRealEstateReviewButtonProps } from './types';
import { useDeleteRealEstateReviewButton } from './hooks';

export const DeleteRealEstateReviewButton: React.FC<DeleteRealEstateReviewButtonProps> = ({
  review,
  onDeleteSuccess,
  showText = false,
  size = 'sm',
  className = '',
}) => {
  const {
    handleDeleteClick,
    handleConfirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isPending,
    isOwner,
  } = useDeleteRealEstateReviewButton({ review, onDeleteSuccess });

  if (!isOwner || !review.user_id) {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        size={size}
        onClick={handleDeleteClick}
        className={className}
        disabled={isPending}
        icon={Trash2}
        iconPosition="left"
        title="Eliminar"
      >
        {showText && <span className="ml-2 hidden md:inline">Eliminar</span>}
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
