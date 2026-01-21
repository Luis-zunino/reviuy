import { PagesUrls } from '@/enums';
import { useDeleteRealEstateReview } from '@/services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseDeleteRealEstateReviewButtonProps } from '../types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const useDeleteRealEstateReviewButton = ({
  review,
  onDeleteSuccess,
}: UseDeleteRealEstateReviewButtonProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isOwner } = useAuthContext();

  const { mutateAsync, isPending } = useDeleteRealEstateReview({
    onSuccess: () => {
      setShowDeleteDialog(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      router.push(PagesUrls.HOME);
    },
  });

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
    isOwner: isOwner(review.user_id),
  };
};
