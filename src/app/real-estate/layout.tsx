import { MainLayout } from '@/components/common/MainLayout';
import type { RealEstateLayoutProps } from './types/realEstateLayout.types';

export default function RealEstateLayout({ children }: RealEstateLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
