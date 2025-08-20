import { reviewMock } from "@/services/mocks/review.mock";
import { Computer, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React from "react";

export const ReviewSummary = () => {
  return (
    <div>
      <div className="flex justify-end pb-4 relative top-5">
        {reviewMock.recommended ? (
          <div className="lg:flex items-center font-bold uppercase justify-center rounded-full text-xs hidden gap-3 h-10 px-4 bg-green-500 text-white">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Lo recomiendo
          </div>
        ) : (
          <div className="lg:flex items-center font-bold uppercase justify-center rounded-full text-xs hidden gap-3 h-10 px-4 bg-red-500 text-white">
            <ThumbsDown className="h-4 w-4 mr-2" />
            No lo recomiendo
          </div>
        )}
      </div>
      <div className="border-b-2 lg:mb-8 mb-4 mt-4">
        <h6 className="mb-2 lg:text-xl font-bold">Opinión</h6>
      </div>
      <div className="flex-1 mb-10">
        <span className="font-bold text-sm md:text-base">
          Horrible experiencia
        </span>
        <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 mb-6">
          <span className="flex align-top gap-4">
            <Computer className="h-4 w-4 mr-2" />
            <span className="flex-1 text-sm md:text-base">
              Horrible experiencia
            </span>
          </span>
          <span className="flex align-top gap-4">
            <ThumbsUp className="h-4 w-4 mr-2" />
            <span className="flex-1 text-sm md:text-base">Res</span>
          </span>
          <span className="flex align-top gap-4">
            <ThumbsDown className="h-4 w-4 mr-2" />
            <div className="flex-1 text-sm md:text-base">
              És realment dolent viure aixì per una parella adulta. No us deixeu
              enganyar pel look cuqui
            </div>
          </span>
        </div>
      </div>
      <div className="border-b-2 lg:mb-8 mb-4 mt-4">
        <h6 className="mb-2 lg:text-xl font-bold">Imágenes</h6>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="text-center cursor-pointer">
          <div className="flex flex-col relative text-center gap-y-2">
            <Image
              alt="selected image"
              width={176}
              height={288}
              className="rounded-md object-cover border border-gray-200 w-44 h-72"
              src="https://firebasestorage.googleapis.com/v0/b/reviu-idra.appspot.com/o/reviews%2F2n3hg9CFJiW0Mj5LhOlQSUlBkT12%2F1718105135065?alt=media&amp;token=667cf39e-fb61-4a40-a9d6-65795ba4baa4"
            />
            <p></p>
          </div>
        </div>
      </div>
      <div className="border-b-2 lg:mb-8 mb-4 mt-4">
        <h6 className="mb-2 lg:text-xl font-bold">Valoración</h6>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Temperatura en verano</span>
          <p className="text-sm md:text-base">Caluroso</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Temperatura en invierno</span>
          <p className="text-sm md:text-base">Frío</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Ruido</span>
          <p className="text-sm md:text-base">Tolerable</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Luz</span>
          <p className="text-sm md:text-base">Luminoso</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Estado y mantenimiento</span>
          <p className="text-sm md:text-base">Aceptable</p>
        </div>
      </div>
      <div className="border-b-2 lg:mb-8 mb-4 mt-4">
        <h6 className="mb-2 lg:text-xl font-bold">Gestión</h6>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 text-sm md:text-base">
          <label>Inmobiliaria</label>
          <div className="text-sm md:text-base cursor-pointer text-secondary-500 font-semibold hover:no-underline">
            Frank+ Partner Architekturen SL | GmbH - Markus Frank
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">
            ¿Cómo ha sido el trato de la inmobiliaria?
          </span>
          <p className="text-sm md:text-base">Malo</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">¿Cómo ha sido el trato del casero?</span>
          <p className="text-sm md:text-base">Sin trato</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">
            ¿Y la respuesta cuando surgió un problema?
          </span>
          <p className="text-sm md:text-base">Buena</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">¿Te devolvieron la fianza?</span>
          <p className="text-sm md:text-base">No</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 my-8">
        <div className="flex flex-col">
          <div className="flex gap-4">
            <ThumbsUp className="h-4 w-4" />
            <div>
              <p className="font-bold text-sm md:text-base">
                ¿Qué consejos le darías a la inmobiliaria?
              </p>
              <p className="text-sm md:text-base">
                Preus molt per sobre de la mitjana del mercat. Crec que shauria
                de ser més realista
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-4">
            <ThumbsUp className="h-4 w-4" />
            <div>
              <p className="font-bold text-sm md:text-base">
                ¿Qué consejos le darías al casero?
              </p>
              <p className="text-sm md:text-base">
                Inversor suís que no havia estat físicament present en el pis
                mai
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-2 mb-8 mt-10">
        <h6 className="mb-2 lg:text-xl font-bold">Comunidad de vecinos</h6>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">
            ¿Cómo definirías la escalera de vecinos?
          </span>
          <p className="text-sm md:text-base">
            Parejas jóvenes, Familiar, Mayores +75 años, Pisos compartidos
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Pisos turísticos</span>
          <p className="text-sm md:text-base">Sí, molestos</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Relación vecinal</span>
          <p className="text-sm md:text-base">Sin relación</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Estado y mantenimiento</span>
          <p className="text-sm md:text-base">Aceptable</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Limpieza</span>
          <p className="text-sm md:text-base">Sin limpieza</p>
        </div>
        <div className="grid col-span-2">
          <div className="flex">
            <p className="pl-2 text-sm md:text-base">
              immobiliària i despatx darquitectura. Inversió suïssa a la qual
              garanteixen rendibilitat, i aquest és el seu únic interès. Les
              reformes són vistoses però no busquen el confort de linquilí - el
              pis molt fred/calorós, llit flotant, menys de 35m2 i les finestres
              donen a terrassa comunitària - molt de soroll. Markus és el tipus
              de personatge que no vols creuar-te, personifica depredació de la
              ciutat
            </p>
          </div>
        </div>
      </div>
      <div className="border-b-2 lg:mb-8 mb-4 mt-4">
        <h5 className="mb-2">Zona (300m)</h5>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Turistas</span>
          <p className="text-sm md:text-base">Bastantes</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Ruido</span>
          <p className="text-sm md:text-base">Ruidosa</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Seguridad</span>
          <p className="text-sm md:text-base">Sin problemas</p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:text-base undefined">
          <span className="font-bold">Limpieza</span>
          <p className="text-sm md:text-base">Buena</p>
        </div>
        <div className="grid col-span-2"></div>
      </div>
    </div>
  );
};
