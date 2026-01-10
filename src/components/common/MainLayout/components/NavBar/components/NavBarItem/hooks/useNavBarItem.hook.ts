import { usePathname } from 'next/navigation';
import { TEXT_VARIANT } from '../constants';
import { UseNavBarItemProps } from './types';

export const useNavBarItem = ({ pageUrl, variant }: UseNavBarItemProps) => {
  const pathname = usePathname();
  const isActive = (route?: string) =>
    route && (pathname === route || pathname.startsWith(route + '/'));

  const setClassNameByVariant = () => {
    if (!isActive(pageUrl)) return '';
    return TEXT_VARIANT[variant];
  };

  return {
    isActive,
    setClassNameByVariant,
  };
};
