'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, SplinePointer } from 'lucide-react';
import type { DeleteReviewDialogProps } from './types';

export const DeleteReviewDialog: React.FC<DeleteReviewDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reviewTitle,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar reseña
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que deseas eliminar esta reseña?
              </p>
              {reviewTitle && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border-l-4 border-red-400">
                  <p className="font-medium">&ldquo;{reviewTitle}&rdquo;</p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Esta acción no se puede deshacer.</p>
                <p className="mt-1">
                  Se eliminará permanentemente la reseña y todos los votos asociados.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting} title="Cancelar">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
            icon={isDeleting ? SplinePointer : Trash2}
            iconPosition="left"
            title={isDeleting ? 'Eliminando' : 'Eliminar'}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar reseña'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
