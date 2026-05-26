'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function ProfileError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Error al cargar el perfil"
      description="No pudimos cargar tu perfil. Intenta de nuevo o inicia sesion nuevamente."
    />
  );
}
