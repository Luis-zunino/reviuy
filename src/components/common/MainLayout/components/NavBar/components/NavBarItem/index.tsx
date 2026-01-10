import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { NavBarItemProps } from './types';
import { ICON_VARIANT } from './constants';
import { useNavBarItem } from './hooks';

export const NavBarItem = (props: NavBarItemProps) => {
  const { pageUrl, Icon, label, variant = 'default', onClick, showInDesktop = false } = props;
  const { setClassNameByVariant } = useNavBarItem({ pageUrl, variant });

  return (
    <DropdownMenuItem
      variant={variant}
      className={`${showInDesktop ? '' : 'md:hidden'} px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:cursor-pointer ${setClassNameByVariant()}`}
    >
      <Link href={pageUrl ?? '#'} className="flex items-center gap-2 px-3 py-2" onClick={onClick}>
        {Icon && <Icon className="w-4 h-4" color={ICON_VARIANT[variant]} />}
        {label}
      </Link>
    </DropdownMenuItem>
  );
};
