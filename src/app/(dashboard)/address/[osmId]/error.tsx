'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function AddressError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <ErrorPage
      reset={reset}
      title="Error al cargar la direccion"
      description="No pudimos obtener la informacion de esta direccion. Es posible que el recurso no exista o haya ocurrido un error temporal."
      homeHref="/explorar"
    />
  );
}
