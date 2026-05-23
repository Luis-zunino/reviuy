'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function ReviewError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <ErrorPage
      reset={reset}
      title="Error al cargar la resena"
      description="No pudimos obtener la informacion de esta resena. Es posible que no exista o que hayas perdido la conexion."
    />
  );
}
