import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/components/ui/button';

// Extraer los tipos de variante y tamaño del componente Button
export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface BaseButtonProps {
  showText?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}
