import { PagesUrls } from '@/enums';
import Link from 'next/link';
import Image from 'next/image';
import LogoIcon from '../../../../../../../app/icon.192.png';

export const Logo = () => {
  return (
    <div className="flex items-center gap-1 group relative rounded-lg px-4 py-4">
      <div className="rounded-lg flex items-center justify-center z-10">
        <Image
          src={LogoIcon}
          height={30}
          width={30}
          alt="Logo principal de ReviUy"
          priority
          quality={95}
        />
      </div>
      <Link href={PagesUrls.HOME} className="text-xl z-10 font-semibold relative">
        <span className="text-blue-600  transition-colors duration-300 group-hover:text-white font-semibold relative">
          Revi
        </span>
        <span className="text-[#FFC425]">Uy</span>
      </Link>
    </div>
  );
};
