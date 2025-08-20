'use client';

import { BackButton, FeedBackBadge, Loading } from '@/components/common';
import { MapComponent } from '@/components/common/MapComponent';
import { PagesUrls } from '@/enums';
import { reviewMock } from '@/services/mocks/review.mock';
import { NominatimByOsmId } from '@/types/nominatimEntity';
import { Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const ViewAddressReviews = ({ osmId }: { osmId: string }) => {
  const [data, setData] = useState<NominatimByOsmId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&format=json&extratags=1`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data: NominatimByOsmId[] = await response.json();
      setData(data[0]);
    } catch (error) {
      toast.error('Error fetching addresses');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [osmId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses, osmId]);

  return (
    <div className="lg:p-14 bg-white p-4 mb-11 lg:mb-0">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2 mb-7">
              <BackButton handleOnClick={() => router.push(PagesUrls.HOME)} />
              <h1 className="text-2xl lg:text-3xl  font-secondary">
                {data?.address.road}, {data?.address.house_number}, {data?.address.city}
              </h1>
              <p className="text-sm tracking-widest">
                {data?.address.suburb}, {data?.address.postcode}
              </p>
            </div>
            <div className="relative hidden md:block">
              <button
                className="flex items-center bg-white rounded-md p-1 border w-auto"
                id="headlessui-menu-button-:rl9:"
                type="button"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                <span className="m-2">Compartir</span>
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="relative grid lg:grid-cols-[1fr_auto] lg:gap-8 md:gap-4 grid-cols-1">
            <div>
              <div className="h-32 sm:h-72 w-full">
                <MapComponent lat={Number(data?.lat)} lon={Number(data?.lon)}>
                  {data?.address.road}, {data?.address.house_number}
                </MapComponent>
              </div>
              <div className="border-b border-b-gray-400 w-full flex items-baseline justify-between mt-8 mb-14  md:overflow-visible overflow-auto no-scrollbar">
                <div className="false w-full flex md:gap-12 gap-8">
                  <div className="border-b-2 border-b-secondary-500 cursor-pointer md:whitespace-normal whitespace-nowrap">
                    Reseñas
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>
                    <h2 className="h-plain text-base lg:text-xl">Últimas opiniones</h2>
                    <div className="relative border border-gray-300 rounded-md overflow-hidden my-6">
                      <FeedBackBadge recommended={reviewMock.recommended} />
                      <div className="flex flex-col lg:flex-row lg:mx-6 lg:p-0 lg:pb-4 px-4 py-6 border-b-2 gap-6">
                        <div className="grid grid-cols-[1fr_auto] lg:w-1/3">
                          <div className="flex flex-col lg:gap-5 gap-3">
                            <span className="font-bold text-sm md:text-base">
                              03 01
                              <p className="text-xs md:text-base font-normal flex ">
                                Carrer de Gombau 12
                              </p>
                              <p className="text-xs md:text-base font-normal flex ">Barcelona</p>
                            </span>
                            <div className="flex items-center">
                              <div className="flex w-5 h-5">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 256 256"
                                  color="#546E7A"
                                  height="20"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M128,166a38,38,0,1,0-38-38A38,38,0,0,0,128,166Zm0-64a26,26,0,1,1-26,26A26,26,0,0,1,128,102ZM240,58H16a6,6,0,0,0-6,6V192a6,6,0,0,0,6,6H240a6,6,0,0,0,6-6V64A6,6,0,0,0,240,58ZM22,108.82A54.73,54.73,0,0,0,60.82,70H195.18A54.73,54.73,0,0,0,234,108.82v38.36A54.73,54.73,0,0,0,195.18,186H60.82A54.73,54.73,0,0,0,22,147.18ZM234,96.29A42.8,42.8,0,0,1,207.71,70H234ZM48.29,70A42.8,42.8,0,0,1,22,96.29V70ZM22,159.71A42.8,42.8,0,0,1,48.29,186H22ZM207.71,186A42.8,42.8,0,0,1,234,159.71V186Z"></path>
                                </svg>
                              </div>
                              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                                Precio 685€
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="flex w-5 h-5">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 256 256"
                                  color="#546E7A"
                                  height="20"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                                </svg>
                              </div>
                              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                                Vivió desde el 2024 hasta el 2025
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="flex w-5 h-5">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 256 256"
                                  color="#546E7A"
                                  height="20"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
                                </svg>
                              </div>
                              <p className="text-neutral-400 ml-2 text-xs md:text-sm ">
                                Ha vivido 1 año en esa direccion
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-sm md:text-base">
                            Mi estancia fue muy incomoda, además una de las personas que viven me
                            amenazo
                          </span>
                          <div className="flex flex-col lg:gap-6 gap-4 lg:mt-8 mt-4 lg:mb-6">
                            <div className="flex align-top gap-4 ">
                              <span className="flex-1 text-sm md:text-base">
                                Esta bien ubicada.
                              </span>
                            </div>
                            <div className="flex align-top gap-4 ">
                              <div className="flex-1 text-sm md:text-base">
                                No hay ambiente agradable, la casa está muy sucia, faltan muchas
                                cosas en la cocina (sartenes, platos, etc.), devuelven la fianza muy
                                tarde y hay que trabajar duro para recuperarla, alquiler muy caro,
                                te cortan 25% de fianza.{' '}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex justify-between mx-6">
                        <div className="py-2 text-primary-500 cursor-pointer text-sm md:text-base">
                          Ver más
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
