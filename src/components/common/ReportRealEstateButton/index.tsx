'use client';

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
import { useReportRealEstateButton } from './hooks';
import type { ReportRealEstateButtonProps } from './types';

export const ReportRealEstateButton = ({
  realEstate,
  showText = false,
}: ReportRealEstateButtonProps) => {
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
    hasReported,
    reportReasons,
  } = useReportRealEstateButton({
    realEstate,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="report" size="sm" disabled={hasReported} icon={Flag}>
          {showText && <span className="hidden sm:inline">Reportar</span>}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Reportar Inmobiliaria
          </DialogTitle>
          <DialogDescription>
            Si consideras que esta inmobiliaria viola nuestras políticas, por favor selecciona el
            motivo y proporciona detalles adicionales.
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
              placeholder="Proporciona más detalles sobre por qué estás reportando esta inmobiliaria..."
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
