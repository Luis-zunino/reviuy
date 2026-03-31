import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-ring/30 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        outline:
          'bg-background text-foreground border-2 border-border hover:border-border hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        success:
          'bg-reviuy-success-500 text-white hover:bg-reviuy-success-600 dark:bg-reviuy-success-600 dark:hover:bg-reviuy-success-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        warning:
          'bg-reviuy-warning-500 text-reviuy-gray-900 hover:bg-reviuy-warning-600 dark:bg-reviuy-warning-600 dark:hover:bg-reviuy-warning-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        ghost:
          'bg-transparent text-foreground/80 hover:bg-accent hover:text-accent-foreground hover:cursor-pointer',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/90 dark:text-reviuy-primary-400 dark:hover:text-reviuy-primary-300 hover:cursor-pointer',
        // Variantes específicas de la plataforma
        like: 'bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30 dark:hover:bg-blue-500/20 dark:hover:border-blue-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 data-[active=true]:bg-blue-100 data-[active=true]:border-blue-500 data-[active=true]:text-blue-600 dark:data-[active=true]:bg-blue-500/20 dark:data-[active=true]:border-blue-400 dark:data-[active=true]:text-blue-200 data-[active=true]:[&_svg]:fill-current hover:cursor-pointer',
        favorite:
          'bg-red-50 text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-100 hover:text-red-600 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30 dark:hover:bg-red-500/20 dark:hover:border-red-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 data-[active=true]:bg-red-100 data-[active=true]:border-red-500 data-[active=true]:text-red-600 dark:data-[active=true]:bg-red-500/20 dark:data-[active=true]:border-red-400 dark:data-[active=true]:text-red-200 data-[active=true]:[&_svg]:fill-current hover:cursor-pointer',
        share:
          'bg-violet-50 text-violet-700 border border-violet-200 hover:border-violet-400 hover:bg-violet-100 hover:text-violet-600 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30 dark:hover:bg-violet-500/20 dark:hover:border-violet-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        report:
          'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100 hover:text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/30 dark:hover:bg-yellow-500/20 dark:hover:border-yellow-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        seeMore:
          'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-400 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30 dark:hover:bg-green-500/20 dark:hover:border-green-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
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
