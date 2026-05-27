'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function AddressError({
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
      title="Error al cargar la direccion"
      description="No pudimos obtener la informacion de esta direccion. Es posible que el recurso no exista o haya ocurrido un error temporal."
      homeHref="/explorar"
    />
  );
}
