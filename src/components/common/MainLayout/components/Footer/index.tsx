import { PagesUrls } from '@/enums';
import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="flex flex-col justify-between w-full bg-black lg:px-44 lg:py-24 p-6 text-white">
      <div className="flex lg:flex-row gap-8 lg:justify-between flex-col lg:text-left text-center lg:mt-0 mt-8">
        <div className="lg:w-[280px]">
          <h4 className="font-extrabold text-base lg:text-2xl lg:block mb-4">
            Encontrá tu lugar ideal con reseñas reales
          </h4>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-violet-300 font-bold">Empresa</li>
            <li className="cursor-pointer">
              <Link href={PagesUrls.ABOUT} title="Información sobre Reviu">
                Sobre nosotros
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:text-left">
          <ul className="flex flex-col gap-4">
            <li className="text-violet-300 font-bold">Legal</li>
            <li className="cursor-pointer">
              <Link href={PagesUrls.PRIVACY_POLICY} title="Política de privacidad">
                Política de privacidad
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link href={PagesUrls.TERMS_AND_CONDITIONS} title="Términos y condiciones de uso">
                Términos y condiciones
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link href={PagesUrls.GOOD_PRACTICES} title="Buenas prácticas">
                Buenas prácticas
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex lg:flex-row lg:justify-between flex-col items-center mt-12 ">ReviUy</div>
    </footer>
  );
};
