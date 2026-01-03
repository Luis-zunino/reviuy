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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Reseña
          </DialogTitle>
          <DialogDescription className="pt-2">
            ¿Estás seguro de que deseas eliminar esta reseña?
            {reviewTitle && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md border-l-4 border-red-400">
                <p className="font-medium text-gray-900">&ldquo;{reviewTitle}&rdquo;</p>
              </div>
            )}
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
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
            icon={isDeleting ? SplinePointer : Trash2}
            iconPosition="left"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Reseña'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
