import { useDeleteRealEstateReview } from '@/services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UseDeleteRealEstateReviewButtonProps } from '../types';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export const useDeleteRealEstateReviewButton = ({
  review,
}: UseDeleteRealEstateReviewButtonProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isOwner } = useAuthContext();

  const { mutateAsync, isPending } = useDeleteRealEstateReview();

  const handleOpenDeleteModal = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!review.id) return;

    toast.loading('Eliminando reseña...', {
      id: `delete-${review.id}`,
    });

    await mutateAsync(
      { reviewId: review.id },
      {
        onSuccess: (data) => {
          toast.dismiss(`delete-${review.id}`);

          if (data.success) {
            toast.success('Reseña eliminada', {
              description: data.message,
            });
            router.back();
          } else {
            toast.error('Error al eliminar', {
              description: data.message || 'No se pudo eliminar la reseña',
            });
          }
        },

        onError: () => {
          toast.dismiss(`delete-${review.id}`);

          toast.error('Error inesperado', {
            description: 'No se pudo eliminar la reseña. Inténtalo de nuevo.',
          });
        },
      }
    );
  };

  return {
    handleOpenDeleteModal,
    handleConfirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isPending,
    isOwner: isOwner(review.user_id),
  };
};
