import { PagesUrls } from '@/enums';
import { useUser } from '@/hooks';
import { useDeleteRealEstateReview } from '@/services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseDeleteRealEstateReviewButtonProps } from '../types';

export const useDeleteRealEstateReviewButton = ({
  review,
  onDeleteSuccess,
}: UseDeleteRealEstateReviewButtonProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { userId, isAuthenticated } = useUser();

  const { mutateAsync, isPending } = useDeleteRealEstateReview({
    onSuccess: () => {
      setShowDeleteDialog(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      router.push(PagesUrls.HOME);
    },
  });

  const isOwner = isAuthenticated && userId && review.user_id && userId === review.user_id;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await mutateAsync({ reviewId: review.id });
  };

  return {
    handleDeleteClick,
    handleConfirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isPending,
    isOwner,
  };
};
