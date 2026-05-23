'use client';

import { ErrorPage } from '@/components/common/ErrorPage';

export default function RealEstateError({
  reset,
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <ErrorPage
      reset={reset}
      title="Error al cargar la propiedad"
      description="No pudimos obtener la informacion de esta propiedad. Es posible que no exista o que haya ocurrido un error temporal."
      homeHref="/explorar"
    />
  );
}
