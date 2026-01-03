'use client';

import React from 'react';
import { Flag, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useReportReviewButton } from './hooks';
import { ReportReviewButtonProps } from './types';

export const ReportReviewButton = ({ review, showText = false }: ReportReviewButtonProps) => {
  const {
    isOpen,
    setIsOpen,
    handleSubmit,
    selectedReason,
    setSelectedReason,
    description,
    setDescription,
    handleCancel,
    isPending,
    showReportedButton,
    hasReported,
    reportReasons,
  } = useReportReviewButton({
    review,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showReportedButton ? (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200"
            disabled={hasReported}
          >
            <Flag className="h-4 w-4" />
            {showText && <span className="hidden sm:inline">Reportar</span>}
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Reportar Reseña
          </DialogTitle>
          <DialogDescription>
            Si consideras que esta reseña viola nuestras políticas, por favor selecciona el motivo y
            proporciona detalles adicionales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="reason">Motivo del reporte *</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} required>
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="text-sm font-normal cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción adicional (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Proporciona más detalles sobre por qué estás reportando esta reseña..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{description.length}/500 caracteres</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
