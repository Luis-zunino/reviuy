import { cn } from '@/lib/utils';
import type { SkeletonProps } from './types';

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} aria-hidden="true" />;
};
