export type LoadingVariant = 'spinner' | 'inline' | 'overlay';

export interface LoadingProps {
  message?: string;
  className?: string;
  variant?: LoadingVariant;
  size?: 'sm' | 'md' | 'lg';
}

export interface SkeletonProps {
  className?: string;
}

export interface ListSkeletonProps {
  items?: number;
  variant?: 'default' | 'compact';
}
