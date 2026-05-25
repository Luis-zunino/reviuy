import { useHasUserReportedReview, useReportReview } from '@/modules/property-reviews/presentation';
import { useSendReportReviewMessage } from '@/modules/moderation/presentation';
import React, { useState } from 'react';
import { validateText } from '@/utils/textValidation.util';
import { toast } from 'sonner';
import type { UseReportReviewButtonProps } from './types';
import { reportReviewReasons } from '@/constants/report-review-reasons.constant';

export const useReportReviewButton = (props: UseReportReviewButtonProps) => {
  const { review } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending } = useReportReview();
  const { mutateAsync: sendMessage } = useSendReportReviewMessage();
  const { data: hasReported } = useHasUserReportedReview(review.id ?? '');

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
        review_id: review.id ?? '',
        reason: selectedReason,
        description: description.trim() || undefined,
      },
      {
        onSuccess: async ({ success, message, error }) => {
          if (success) {
            toast.success(message || 'Reporte enviado');
            setIsOpen(false);
            setSelectedReason('');
            setDescription('');
            await sendMessage({
              reviewUuid: review.id ?? '',
              reason: selectedReason,
              message: description,
            });
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
    onOpenChange: setIsOpen,
    onSubmit: handleSubmit,
    selectedReason,
    onReasonChange: setSelectedReason,
    description,
    onDescriptionChange: setDescription,
    onCancel: handleCancel,
    isPending,
    showReportedButton: !review?.is_mine,
    hasReported,
    reportReasons: reportReviewReasons,
  };
};
