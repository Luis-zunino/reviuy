import {
  useHasUserReportedRealEstate,
  useReportRealEstate,
} from '@/modules/real-estates/presentation';
import { useSendReportRealEstateMessage } from '@/modules/moderation/presentation';
import React, { useState } from 'react';
import { validateText } from '@/utils';
import { toast } from 'sonner';
import type { UseReportRealEstateButtonProps } from './types';

export const useReportRealEstateButton = (props: UseReportRealEstateButtonProps) => {
  const { realEstate } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending } = useReportRealEstate();
  const { mutateAsync: sendMessage } = useSendReportRealEstateMessage();
  const { data: hasReported } = useHasUserReportedRealEstate(realEstate.id ?? undefined);

  const reportReasons = [
    { value: 'fraud', label: 'Posible fraude o estafa' },
    { value: 'fake', label: 'Inmobiliaria falsa o inexistente' },
    { value: 'inappropriate', label: 'Comportamiento inapropiado' },
    { value: 'spam', label: 'Spam o contenido promocional' },
    { value: 'illegal', label: 'Actividad ilegal' },
    { value: 'poor_service', label: 'Mala praxis profesional' },
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

    await mutateAsync(
      {
        real_estate_id: realEstate.id ?? '',
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
              reason: selectedReason,
              message: description,
              realEstateName: realEstate.name ?? '',
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
    setIsOpen,
    handleSubmit,
    selectedReason,
    setSelectedReason,
    description,
    setDescription,
    handleCancel,
    isPending,
    hasReported,
    reportReasons,
  };
};
