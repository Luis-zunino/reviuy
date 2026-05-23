'use client';

import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/common/ReportDialog';
import { useReportReviewButton } from './hooks';
import { ReportReviewButtonProps } from './types';

export const ReportReviewButton = ({ review, showText = false }: ReportReviewButtonProps) => {
  const hook = useReportReviewButton({ review });

  const trigger = hook.showReportedButton ? (
    <Button variant="report" size="sm" disabled={hook.hasReported} icon={Flag}>
      {showText && <span className="hidden sm:inline">Reportar</span>}
    </Button>
  ) : null;

  return (
    <ReportDialog
      isOpen={hook.isOpen}
      onOpenChange={hook.setIsOpen}
      trigger={trigger}
      onSubmit={hook.handleSubmit}
      selectedReason={hook.selectedReason}
      onReasonChange={hook.setSelectedReason}
      description={hook.description}
      onDescriptionChange={hook.setDescription}
      onCancel={hook.handleCancel}
      isPending={hook.isPending}
      reportReasons={hook.reportReasons}
      title="Reportar Reseña"
      dialogDescription="Si consideras que esta reseña viola nuestras políticas, por favor selecciona el motivo y proporciona detalles adicionales."
      textareaPlaceholder="Proporciona más detalles sobre por qué estás reportando esta reseña..."
    />
  );
};
