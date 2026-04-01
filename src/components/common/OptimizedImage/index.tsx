import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Componente optimizado de imagen que extiende next/image
 * con mejores defaults para Core Web Vitals (LCP, CLS)
 *
 * @example
 * ```tsx
 * // Imagen prioritaria (above-fold, impacta LCP)
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 *   priority
 * />
 *
 * // Imagen lazy (below-fold)
 * <OptimizedImage
 *   src="/product.jpg"
 *   alt="Product"
 *   width={400}
 *   height={300}
 * />
 *
 * // Avatar de usuario con fallback
 * <OptimizedImage
 *   src={user.avatar_url}
 *   alt={user.name}
 *   width={48}
 *   height={48}
 *   className="rounded-full"
 * />
 * ```
 */

export interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  /**
   * Mostrar placeholder blur mientras carga
   * @default true para imágenes prioritarias, false para lazy
   */
  blurPlaceholder?: boolean;
  /**
   * Calidad de la imagen (1-100)
   * @default 85 (balance entre calidad y tamaño)
   */
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  className,
  sizes,
  ...props
}) => {
  // Auto-configurar sizes si no se proporciona
  const defaultSizes =
    sizes ||
    (priority
      ? '100vw' // Imágenes prioritarias suelen ser hero images
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      sizes={defaultSizes}
      className={cn(className)}
      // Prevenir Layout Shift configurando dimensiones
      style={{
        maxWidth: '100%',
        height: 'auto',
        ...props.style,
      }}
      {...props}
    />
  );
};
