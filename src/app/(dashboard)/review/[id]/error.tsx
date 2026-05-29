'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function ReviewError({
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
      title="Error al cargar la reseña"
      description="No pudimos obtener la informacion de esta reseña. Es posible que no exista o que hayas perdido la conexion."
    />
  );
}
