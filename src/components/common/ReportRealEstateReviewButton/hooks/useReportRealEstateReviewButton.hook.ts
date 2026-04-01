import {
  useHasUserReportedRealEstateReview,
  useReportRealEstateReview,
} from '@/modules/real-estates/presentation';
import { useSendReportRealEstateReviewMessage } from '@/modules/moderation/presentation';
import React, { useState } from 'react';
import { validateText } from '@/utils';
import { toast } from 'sonner';
import type { UseReportRealEstateReviewButtonProps } from './types';

export const useReportRealEstateReviewButton = (props: UseReportRealEstateReviewButtonProps) => {
  const { review } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending } = useReportRealEstateReview();
  const { mutateAsync: sendMessage } = useSendReportRealEstateReviewMessage();
  const { data: hasReported } = useHasUserReportedRealEstateReview(review?.id ?? '');

  const reportReasons = [
    { value: 'spam', label: 'Spam o contenido promocional no solicitado' },
    { value: 'inappropriate', label: 'Contenido inapropiado o ofensivo' },
    { value: 'false_info', label: 'Información falsa o engañosa' },
    { value: 'harassment', label: 'Acoso o intimidación' },
    { value: 'hate_speech', label: 'Discurso de odio' },
    { value: 'fake_review', label: 'Reseña falsa o fraudulenta' },
    { value: 'other', label: 'Otro motivo' },
  ];

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

    if (!review?.id) return;
    await mutateAsync(
      {
        review_id: review.id,
        reason: selectedReason,
        description: description.trim(),
      },
      {
        onSuccess: async ({ success, message, error }) => {
          if (success) {
            toast.success(message || 'Reporte enviado');
            await sendMessage({
              reason: selectedReason,
              message: description,
              realEstateReviewUuid: review.id ?? '',
            });
            setIsOpen(false);
            setSelectedReason('');
            setDescription('');
          } else {
            toast.error(error || 'Error al enviar el reporte');
          }
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
    showReportedButton: !review?.is_mine,
    hasReported,
    reportReasons,
  };
};
