import { useHasUserReportedReview, useReportReview } from '@/services';
import React, { useState } from 'react';
import { validateText } from '@/utils';
import { toast } from 'sonner';
import type { UseReportReviewButtonProps } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const useReportReviewButton = (props: UseReportReviewButtonProps) => {
  const { review } = props;
  const { userId } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending } = useReportReview();
  const { data: hasReported } = useHasUserReportedReview(review.id);

  const reportReasons = [
    { value: 'spam', label: 'Spam o contenido promocional no solicitado' },
    { value: 'inappropriate', label: 'Contenido inapropiado o ofensivo' },
    { value: 'false_info', label: 'Información falsa o engañosa' },
    { value: 'harassment', label: 'Acoso o intimidación' },
    { value: 'hate_speech', label: 'Discurso de odio' },
    { value: 'copyright', label: 'Violación de derechos de autor' },
    { value: 'other', label: 'Otro motivo' },
  ];

  const isOwner = userId && review?.user_id && userId === review.user_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      return;
    }

    if (description.trim()) {
      const validation = validateText(description);
      if (!validation.isValid) {
        toast.error(validation.message || 'El texto contiene contenido no permitido');
        return;
      }
    }

    await mutateAsync(
      {
        review_id: review.id,
        reason: selectedReason,
        description: description.trim() || undefined,
      },
      {
        onSuccess: ({ message, success, error }) => {
          if (success) {
            toast.success(message || 'Reporte enviado exitosamente');
          } else {
            toast.error(error || 'Error al enviar el reporte');
          }
          setIsOpen(false);
          setSelectedReason('');
          setDescription('');
        },
      }
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedReason('');
    setDescription('');
  };

  return {
    isOpen,
    setIsOpen,
    handleSubmit,
    selectedReason,
    setSelectedReason,
    description,
    setDescription,
    handleCancel,
    isPending,
    showReportedButton: !isOwner,
    hasReported,
    reportReasons,
  };
};
