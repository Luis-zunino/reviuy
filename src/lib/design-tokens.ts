/**
 * REVIUY DESIGN TOKENS
 * Tipos TypeScript para el sistema de diseño
 *
 * Usar estos tipos para autocompletado y validación
 * en componentes React y funciones utilitarias.
 */

// ====================================
// COLORES
// ====================================

export type RevyuiPrimaryColor =
  | 'reviuy-primary-50'
  | 'reviuy-primary-100'
  | 'reviuy-primary-200'
  | 'reviuy-primary-300'
  | 'reviuy-primary-400'
  | 'reviuy-primary-500'
  | 'reviuy-primary-600'
  | 'reviuy-primary-700'
  | 'reviuy-primary-800'
  | 'reviuy-primary-900'
  | 'reviuy-primary-950';

export type RevyuiSecondaryColor =
  | 'reviuy-secondary-50'
  | 'reviuy-secondary-100'
  | 'reviuy-secondary-200'
  | 'reviuy-secondary-300'
  | 'reviuy-secondary-400'
  | 'reviuy-secondary-500'
  | 'reviuy-secondary-600'
  | 'reviuy-secondary-700'
  | 'reviuy-secondary-800'
  | 'reviuy-secondary-900';

export type RevyuiSemanticColor =
  | 'reviuy-success-50'
  | 'reviuy-success-500'
  | 'reviuy-success-600'
  | 'reviuy-success-700'
  | 'reviuy-warning-50'
  | 'reviuy-warning-500'
  | 'reviuy-warning-600'
  | 'reviuy-warning-700'
  | 'reviuy-error-50'
  | 'reviuy-error-500'
  | 'reviuy-error-600'
  | 'reviuy-error-700';

export type RevyuiGrayColor =
  | 'reviuy-gray-50'
  | 'reviuy-gray-100'
  | 'reviuy-gray-200'
  | 'reviuy-gray-300'
  | 'reviuy-gray-400'
  | 'reviuy-gray-500'
  | 'reviuy-gray-600'
  | 'reviuy-gray-700'
  | 'reviuy-gray-800'
  | 'reviuy-gray-900'
  | 'reviuy-gray-950';

export type RevyuiColor =
  | RevyuiPrimaryColor
  | RevyuiSecondaryColor
  | RevyuiSemanticColor
  | RevyuiGrayColor;

// ====================================
// ESPACIADO
// ====================================

export type RevyuiSpacing =
  | 'spacing-xs' // 4px
  | 'spacing-sm' // 8px
  | 'spacing-md' // 12px
  | 'spacing-lg' // 16px
  | 'spacing-xl' // 24px
  | 'spacing-2xl' // 32px
  | 'spacing-3xl' // 48px
  | 'spacing-4xl'; // 64px

// ====================================
// BORDER RADIUS
// ====================================

export type RevyuiRadius =
  | 'radius-xs' // 4px
  | 'radius-sm' // 6px
  | 'radius-md' // 8px
  | 'radius-lg' // 12px
  | 'radius-xl' // 16px
  | 'radius-2xl' // 24px
  | 'radius-full'; // 9999px

// ====================================
// SOMBRAS
// ====================================

export type RevyuiShadow =
  | 'shadow-xs'
  | 'shadow-sm'
  | 'shadow-md'
  | 'shadow-lg'
  | 'shadow-xl'
  | 'shadow-2xl';

// ====================================
// UTILIDADES PARA COMPONENTES
// ====================================

/**
 * Props comunes para componentes que usan el design system
 */
export interface RevyuiStyleProps {
  /** Color del componente */
  color?: RevyuiColor;
  /** Tamaño de espaciado */
  spacing?: RevyuiSpacing;
  /** Border radius */
  radius?: RevyuiRadius;
  /** Sombra del componente */
  shadow?: RevyuiShadow;
}

/**
 * Variantes comunes de componentes UI
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'ghost'
  | 'outline';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ====================================
// CONSTANTES ÚTILES
// ====================================

export const REVIUY_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#fef7ee',
    100: '#fdead3',
    200: '#fbd1a5',
    300: '#f9b06d',
    400: '#f68732',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
} as const;

export const REVIUY_SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
} as const;

export const REVIUY_RADIUS = {
  xs: '0.25rem', // 4px
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ====================================
// FUNCIONES UTILITARIAS
// ====================================

/**
 * Obtiene una clase CSS de color válida para Tailwind
 * @param type - Tipo de propiedad CSS (bg, text, border, etc.)
 * @param color - Color del design system
 * @returns Clase CSS completa
 *
 * @example
 * getColorClass('bg', 'reviuy-primary-500') // 'bg-reviuy-primary-500'
 * getColorClass('text', 'reviuy-gray-700') // 'text-reviuy-gray-700'
 */
export function getColorClass(
  type: 'bg' | 'text' | 'border' | 'ring' | 'divide',
  color: RevyuiColor
): string {
  return `${type}-${color}`;
}

/**
 * Combina múltiples clases de design tokens
 * @param classes - Array de clases CSS
 * @returns String con clases combinadas
 *
 * @example
 * combineClasses(['bg-reviuy-primary-500', 'text-white', 'rounded-xl'])
 * // 'bg-reviuy-primary-500 text-white rounded-xl'
 */
export function combineClasses(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Obtiene las clases para un botón según su variante
 * @param variant - Variante del botón
 * @param size - Tamaño del botón
 * @returns String con clases CSS
 */
export function getButtonClasses(
  variant: ComponentVariant = 'primary',
  size: ComponentSize = 'md'
): string {
  const baseClasses = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-4';

  const variantClasses = {
    primary:
      'bg-reviuy-primary-600 hover:bg-reviuy-primary-700 text-white focus:ring-reviuy-primary-500/20',
    secondary:
      'bg-reviuy-secondary-500 hover:bg-reviuy-secondary-600 text-white focus:ring-reviuy-secondary-500/20',
    success:
      'bg-reviuy-success-500 hover:bg-reviuy-success-600 text-white focus:ring-reviuy-success-500/20',
    warning:
      'bg-reviuy-warning-500 hover:bg-reviuy-warning-600 text-white focus:ring-reviuy-warning-500/20',
    error:
      'bg-reviuy-error-500 hover:bg-reviuy-error-600 text-white focus:ring-reviuy-error-500/20',
    ghost:
      'bg-transparent hover:bg-reviuy-gray-100 text-reviuy-gray-700 focus:ring-reviuy-gray-500/20',
    outline:
      'bg-transparent border-2 border-reviuy-gray-200 hover:border-reviuy-primary-300 hover:bg-reviuy-primary-50 text-reviuy-gray-700 focus:ring-reviuy-primary-500/20',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  return combineClasses(baseClasses, variantClasses[variant], sizeClasses[size]);
}

export default {
  REVIUY_COLORS,
  REVIUY_SPACING,
  REVIUY_RADIUS,
  getColorClass,
  combineClasses,
  getButtonClasses,
} as const;
