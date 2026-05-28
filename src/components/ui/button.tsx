import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

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
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 hover:cursor-pointer',
        // Variantes específicas de la plataforma — monocromo, guiado por icono
        like: 'text-reviuy-gray-400 hover:text-reviuy-gray-700 dark:text-reviuy-gray-500 dark:hover:text-reviuy-gray-200 data-[active=true]:text-reviuy-gray-700 dark:data-[active=true]:text-reviuy-gray-200 data-[active=true]:[&_svg]:fill-current shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        favorite:
          'text-reviuy-gray-400 hover:text-reviuy-gray-700 dark:text-reviuy-gray-500 dark:hover:text-reviuy-gray-200 data-[active=true]:text-reviuy-gray-700 dark:data-[active=true]:text-reviuy-gray-200 data-[active=true]:[&_svg]:fill-current shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        share:
          'border border-reviuy-gray-200 text-reviuy-gray-500 hover:bg-reviuy-gray-50 hover:text-reviuy-gray-700 dark:border-reviuy-gray-600 dark:text-reviuy-gray-400 dark:hover:bg-reviuy-gray-800 dark:hover:text-reviuy-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        report:
          'text-reviuy-gray-400 hover:text-reviuy-gray-600 dark:text-reviuy-gray-500 dark:hover:text-reviuy-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
        seeMore:
          'text-reviuy-gray-500 hover:text-reviuy-gray-700 dark:text-reviuy-gray-400 dark:hover:text-reviuy-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:cursor-pointer',
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

const Button = ({
  ref,
  className,
  variant,
  size,
  asChild = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
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
};

Button.displayName = 'Button';

export { Button, buttonVariants, type ButtonProps };
