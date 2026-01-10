import { PagesUrls } from '@/enums';
import { House } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const Logo = () => {
  return (
    <Link
      href={PagesUrls.HOME}
      className="flex items-center gap-4 group relative rounded-lg px-4 py-4"
    >
      <div className="absolute left-2 top-4 bottom-4 w-8 h-8 bg-linear-to-br p-4 from-blue-500 to-blue-600 rounded-lg transition-all duration-400 ease-out group-hover:w-[calc(100%-1rem)] group-hover:h-8 group-hover:rounded-lg z-0" />

      <div className="rounded-lg flex items-center justify-center z-10">
        <House className="w-4 h-4 text-white relative z-10" />
      </div>
      <span className="text-xl text-gray-900 transition-colors duration-300 group-hover:text-white z-10 font-semibold relative">
        ReviUy
      </span>
    </Link>
  );
};
