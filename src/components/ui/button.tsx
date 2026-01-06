import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-reviuy-primary-600 text-white hover:bg-reviuy-primary-700 focus:ring-reviuy-primary-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        destructive:
          'bg-reviuy-error-500 text-white hover:bg-reviuy-error-600 focus:ring-reviuy-error-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        outline:
          'bg-white text-reviuy-gray-700 border-2 border-reviuy-gray-200 hover:border-reviuy-primary-300 hover:bg-reviuy-primary-50 focus:ring-reviuy-primary-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        secondary:
          'bg-reviuy-secondary-200 text-white hover:bg-reviuy-secondary-500 focus:ring-reviuy-secondary-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        success:
          'bg-reviuy-success-500 text-white hover:bg-reviuy-success-600 focus:ring-reviuy-success-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        warning:
          'bg-reviuy-warning-500 text-white hover:bg-reviuy-warning-600 focus:ring-reviuy-warning-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        ghost:
          'bg-transparent text-reviuy-gray-700 hover:bg-reviuy-gray-100 focus:ring-reviuy-gray-500/20',
        link: 'text-reviuy-primary-600 underline-offset-4 hover:underline hover:text-reviuy-primary-700',
        // Variantes específicas de la plataforma
        like: 'bg-blue-50 text-blue-700 border-1 border-blue-50 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-600 focus:ring-blue-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 data-[active=true]:bg-blue-100 data-[active=true]:border-blue-500 data-[active=true]:text-blue-600 data-[active=true]:[&_svg]:fill-current',
        favorite:
          'bg-red-50 text-red-700 border-1 border-red-50 hover:border-red-400 hover:bg-red-100 hover:text-red-600 focus:ring-red-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 data-[active=true]:bg-red-100 data-[active=true]:border-red-500 data-[active=true]:text-red-600 data-[active=true]:[&_svg]:fill-current',
        share:
          'bg-violet-50 text-violet-700 border-1 border-violet-50 hover:border-violet-400 hover:bg-violet-100 hover:text-violet-600 focus:ring-violet-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        report:
          'bg-yellow-50 text-yellow-700 border-1 border-yellow-50 hover:border-yellow-400 hover:bg-yellow-100 hover:text-yellow-600 focus:ring-yellow-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        seeMore:
          'bg-green-50 text-green-700 border-2 border-green-50 hover:bg-green-100 hover:border-green-400 focus:ring-green-500/20 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
      },
      size: {
        xs: 'h-8 px-3 py-1.5 text-xs rounded-lg gap-1.5',
        sm: 'h-9 px-4 py-2 text-sm rounded-lg gap-2',
        default: 'h-11 px-6 py-3 text-sm rounded-xl gap-2 min-h-[44px]',
        lg: 'h-12 px-8 py-4 text-base rounded-xl gap-3',
        xl: 'h-14 px-10 py-5 text-lg rounded-2xl gap-3',
        icon: 'size-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Icono a mostrar en el botón */
  icon?: LucideIcon;
  /** Posición del icono - izquierda o derecha */
  iconPosition?: 'left' | 'right';
  /** Texto del botón cuando se usa con icono */
  children?: React.ReactNode;
}

// Mapeo de tamaños de botón a tamaños de icono que coinciden con el texto
const iconSizeMap = {
  xs: 12, // text-xs (12px)
  sm: 14, // text-sm (14px)
  default: 14, // text-sm (14px)
  lg: 16, // text-base (16px)
  xl: 18, // text-lg (18px)
  icon: 18, // Para botones de solo icono, un poco más grande
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon: Icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Si no hay children y hay icono, es un botón de solo icono
    const isIconOnly = !children && Icon;
    const effectiveSize = isIconOnly ? 'icon' : size;

    // Obtener el tamaño del icono basado en el tamaño del botón
    const iconSize = iconSizeMap[effectiveSize || 'default'];

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          'flex items-center gap-2',
          buttonVariants({ variant, size: effectiveSize, className })
        )}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon size={iconSize} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon size={iconSize} />}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };
