import { reviewMock } from "@/services/mocks/review.mock";
import React from "react";

export const ReviewSidebar = () => {
  return (
    <div className="lg:border-none border border-gray-300 rounded-md ">
      <div className="flex items-center font-bold uppercase justify-center rounded-full lg:hidden text-xs gap-3 h-10 bg-red-500 text-white">
        {reviewMock.recommended ? "Lo recomiendo" : "No lo recomiendo"}
      </div>
      <div className="lg:mt-3 mt-0 lg:p-0 p-4 overflow-hidden sticky top-10">
        <div className="lg:flex lg:flex-col lg:justify-end lg:pb-4 lg:sticky top-5 grid grid-cols-[1fr_auto]">
          <div className="lg:w-72 flex flex-col lg:gap-5 gap-2 lg:mt-4">
            <div className="font-bold text-sm md:text-base">
              02 01
              <p className="text-xs md:text-base font-normal flex ">
                Carrer de los Castillejos 181
              </p>
              <p className="text-xs md:text-base font-normal flex ">
                Barcelona
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                Precio inicial 800€ - Precio final 830€
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                Vivió desde el 2017 hasta el 2020
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                Ha vivido 3 años en esa direccion
              </p>
            </div>
          </div>
          {/* Mapa */}
        </div>
      </div>
    </div>
  );
};
