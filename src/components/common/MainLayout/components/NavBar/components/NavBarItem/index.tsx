import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { NavBarItemProps } from './types';

/**
 * Componente de un ítem del NavBar.
 *
 * Este componente representa un enlace en la barra de navegación, con soporte para íconos,
 * variantes de estilo, y visibilidad condicional en dispositivos de escritorio.
 * @param props - Propiedades del NavBarItem
 * @param props.pageUrl - URL a la que redirige el ítem
 * @param props.icon - Componente de ícono opcional para mostrar junto al texto
 * @param props.label - Texto del ítem de navegación
 * @param props.variant - Variante de estilo (default, active, etc.)
 * @param props.onClick - Función a ejecutar al hacer clic en el ítem
 * @param props.showInDesktop - Si es true, el ítem se muestra también en dispositivos de escritorio
 * @returns
 */
export const NavBarItem = (props: NavBarItemProps) => {
  const { pageUrl, icon: Icon, label, variant = 'default', onClick, showInDesktop = false } = props;

  return (
    <DropdownMenuItem
      variant={variant}
      className={`${showInDesktop ? '' : 'md:hidden'} p-0 hover:cursor-pointer`}
    >
      <Link
        href={pageUrl ?? '#'}
        className="flex items-center gap-2 w-full"
        onClick={onClick}
        data-variant={variant}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    </DropdownMenuItem>
  );
};
