'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteAccount } from '@/services';
import { useState } from 'react';

export const DeleteAccountSection = () => {
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border border-red-200 rounded-lg bg-red-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Zona de Peligro</h3>
      </div>

      <p className="text-sm text-red-700 mb-6">
        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten en cuenta que tus
        reseñas se mantendrán en la plataforma para ayudar a la comunidad, pero serán anonimizadas
        permanentemente (se desvincularán de tu usuario).
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full sm:w-auto">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar mi cuenta
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta de acceso y
              tus datos. Tus reseñas públicas permanecerán visibles pero anónimas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => deleteAccount()}
              disabled={isPending}
              iconPosition="left"
              title={isPending ? 'Eliminando...' : 'Sí, eliminar cuenta'}
              variant="destructive"
            >
              {isPending ? 'Eliminando...' : 'Sí, eliminar cuenta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
