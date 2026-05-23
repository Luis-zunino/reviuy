'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function ProfileError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <ErrorPage
      reset={reset}
      title="Error al cargar el perfil"
      description="No pudimos cargar tu perfil. Intenta de nuevo o inicia sesion nuevamente."
    />
  );
}
