'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteReviewDialog } from '@/components/common';
import { useDeleteRealEstateReview } from '@/services';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { DeleteRealEstateReviewButtonProps } from './types';

export const DeleteRealEstateReviewButton: React.FC<DeleteRealEstateReviewButtonProps> = ({
  review,
  onDeleteSuccess,
  showText = false,
  variant = 'ghost',
  size = 'sm',
  className = '',
}) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, isAuthenticated } = useUser();

  const deleteReviewMutation = useDeleteRealEstateReview({
    onSuccess: () => {
      setShowDeleteDialog(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      router.push(PagesUrls.HOME);
    },
  });

  const isOwner = isAuthenticated && user?.id && review.user_id && user.id === review.user_id;

  if (!isOwner || !review.user_id) {
    return null;
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteReviewMutation.mutate({ reviewId: review.id });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleDeleteClick}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
        disabled={deleteReviewMutation.isPending}
        icon={Trash2}
        iconPosition="left"
      >
        {showText && <span className="ml-2">Eliminar</span>}
      </Button>

      <DeleteReviewDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        reviewTitle={review.title}
        isDeleting={deleteReviewMutation.isPending}
      />
    </>
  );
};
