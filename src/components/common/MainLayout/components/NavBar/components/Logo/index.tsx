import { PagesUrls } from '@/enums';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import LogoIcon from '../../../../../../../app/icon.192.png';

export const Logo = () => {
  return (
    <Link
      href={PagesUrls.HOME}
      className="flex items-center gap-4 group relative rounded-lg px-4 py-4"
    >
      <div className="absolute top-4 bottom-4 w-8 h-8 bg-linear-to-br p-4 from-blue-600 to-blue-600 rounded-lg transition-all duration-400 ease-out group-hover:w-[calc(100%-1rem)] group-hover:h-8 group-hover:rounded-lg z-0" />
      <div className="rounded-lg flex items-center justify-center z-10">
        <Image src={LogoIcon} height={30} width={30} alt="Logo principal de Reviuy" />
      </div>
      <span className="text-xl z-10 font-semibold relative">
        <span className="text-blue-600  transition-colors duration-300 group-hover:text-white font-semibold relative">
          Revi
        </span>
        <span className="text-[#FFC425]">Uy</span>
      </span>
    </Link>
  );
};
