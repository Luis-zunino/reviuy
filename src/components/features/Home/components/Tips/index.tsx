'use client';

import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const Tips = () => {
  const router = useRouter();

  return (
    <div className="lg:mx-40 flex flex-col">
      <div className="flex flex-col items-center my-4">
        <div className="flex justify-center mt-6 mb-14 ">
          <h2 className="xs:text-2xl">Te ayudamos a tomar la mejor decisión</h2>
        </div>
        <div className="w-full relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 sm:gap-4 md:gap-6 ">
          <div className="grid grid-cols-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="max-h-52">
              <Image
                alt="Imagen"
                width={600}
                height={400}
                className="object-cover h-full"
                src="https://placehold.co/600x400"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 sm:pr-12">
                ¿Puedes irte de un piso de alquiler antes de tiempo?
              </h2>
              <section aria-labelledby="information-heading" className="mt-3">
                <h3 id="information-heading" className="sr-only">
                  Description
                </h3>
                <p className="text-sm text-gray-700 max-h-20 overflow-hidden">
                  <span className="inline-block max-h-full overflow-ellipsis">
                    Si has firmado un contrato de alquiler de 5 años, y quieres irte antes de
                    tiempo, ¿sabes con cuánta antelación tienes que avisar? ¿Y si es legal que te
                    cobren por irte antes de tiempo? Te lo explicamos.
                  </span>
                </p>
              </section>
              <section aria-labelledby="options-heading" className="mt-6 text-start">
                <Button onClick={() => router.push(`${PagesUrls.TIPS}/1`)}>Ver más</Button>
              </section>
            </div>
          </div>
          <div className="grid grid-cols-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="max-h-52">
              <Image
                alt="Imagen"
                width={600}
                height={400}
                className="object-cover h-full"
                src="https://placehold.co/600x400"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 sm:pr-12">
                ¿Qué no te pueden pedir cuando alquilar un piso?
              </h2>
              <section aria-labelledby="information-heading" className="mt-3">
                <h3 id="information-heading" className="sr-only">
                  Description
                </h3>
                <p className="text-sm text-gray-700 max-h-20 overflow-hidden">
                  <span className="inline-block max-h-full overflow-ellipsis">
                    A la hora de firmar un contrato de alquiler, con los nervios, puede ser que
                    firmemos cosas que legalmente la inmobiliaria o la propiedad no tienen derecho a
                    reclamarnos. Es importante estar atentos cuando leemos el contrato de alquiler y
                    saber qué no nos pueden pedir.{' '}
                  </span>
                </p>
              </section>
              <section aria-labelledby="options-heading" className="mt-6 text-start">
                <Button onClick={() => router.push(`${PagesUrls.TIPS}/2`)}>Ver más</Button>
              </section>
            </div>
          </div>
          <div className="grid grid-cols-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="max-h-52">
              <Image
                alt="Imagen"
                width={600}
                height={400}
                className="object-cover h-full"
                src="https://placehold.co/600x400"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 sm:pr-12">
                ¿Quién tiene que reparar los desperfectos del piso?
              </h2>
              <section aria-labelledby="information-heading" className="mt-3">
                <h3 id="information-heading" className="sr-only">
                  Description
                </h3>
                <p className="text-sm text-gray-700 max-h-20 overflow-hidden">
                  <span className="inline-block max-h-full overflow-ellipsis">
                    Cuando se estropea alguna cosa en nuestro piso, lo tenemos que reparar nosotros?
                    O podemos pedir a nuestro propietario que lo pague?
                  </span>
                </p>
              </section>
              <section aria-labelledby="options-heading" className="mt-6 text-start">
                <Button onClick={() => router.push(`${PagesUrls.TIPS}/3`)}>Ver más</Button>
              </section>
            </div>
          </div>
        </div>
        <Button
          className="btn btn-primary-500 mt-14"
          title="Publicaciones del blog de Reviu"
          onClick={() => router.push(PagesUrls.TIPS)}
          variant="outline"
        >
          Ver todos
        </Button>
      </div>
    </div>
  );
};
