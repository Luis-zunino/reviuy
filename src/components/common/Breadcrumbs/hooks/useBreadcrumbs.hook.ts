import { BreadcrumbItem } from '../types';
import { createBreadcrumbSchema } from '@/components/seo';
import { PagesUrls } from '@/enums';

/**
 * Hook to generate breadcrumbs
 * Automatically includes home as first item and generates Schema.org structured data
 * @example
 * ```tsx
 * const { allItems, breadcrumbSchema } = useBreadcrumbs({ items });
 * ```
 * @param items Array of breadcrumb items
 * @returns All items and breadcrumb schema
 */
export const useBreadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reviuy.vercel.app';

  // Always include home as first item
  const allItems: BreadcrumbItem[] = [{ label: 'Inicio', href: PagesUrls.HOME }, ...items];

  // Generate Schema.org structured data
  const breadcrumbSchema = createBreadcrumbSchema(
    allItems.map((item) => ({
      name: item.label,
      url: item.href ? `${baseUrl}${item.href}` : undefined,
    }))
  );
  return { allItems, breadcrumbSchema };
};
