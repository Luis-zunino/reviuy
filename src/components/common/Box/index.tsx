import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}
export const Box = (props: PropsWithChildren<BoxProps>) => {
  const { children, className } = props;
  return <div className={cn('dark:bg-reviuy-gray-800/50', className)}>{children}</div>;
};
