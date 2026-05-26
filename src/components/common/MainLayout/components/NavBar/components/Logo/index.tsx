import { PagesUrls } from '@/enums';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="flex items-center gap-1 group relative rounded-lg px-4 py-4">
      <Link href={PagesUrls.HOME} className="text-xl z-10 font-semibold relative">
        <span className="text-blue-700 transition-colors duration-300 group-hover:text-white font-semibold relative">
          Revi
        </span>
        <span className="text-[#FFC425]">Uy</span>
      </Link>
    </div>
  );
};
