'use client';

import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/common/ReportDialog';
import { useReportRealEstateButton } from './hooks';
import type { ReportRealEstateButtonProps } from './types';

export const ReportRealEstateButton = ({
  realEstate,
  showText = false,
}: ReportRealEstateButtonProps) => {
  const hook = useReportRealEstateButton({ realEstate });

  return (
    <ReportDialog
      isOpen={hook.isOpen}
      onOpenChange={hook.setIsOpen}
      trigger={
        <Button variant="report" size="sm" disabled={hook.hasReported} icon={Flag}>
          {showText && <span className="hidden sm:inline">Reportar</span>}
        </Button>
      }
      onSubmit={hook.handleSubmit}
      selectedReason={hook.selectedReason}
      onReasonChange={hook.setSelectedReason}
      description={hook.description}
      onDescriptionChange={hook.setDescription}
      onCancel={hook.handleCancel}
      isPending={hook.isPending}
      reportReasons={hook.reportReasons}
      title="Reportar Inmobiliaria"
      dialogDescription="Si consideras que esta inmobiliaria viola nuestras políticas, por favor selecciona el motivo y proporciona detalles adicionales."
      textareaPlaceholder="Proporciona más detalles sobre por qué estás reportando esta inmobiliaria..."
    />
  );
};
