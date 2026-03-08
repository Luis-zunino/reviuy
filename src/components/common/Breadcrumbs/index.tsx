import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { StructuredData } from '@/components/seo';
import { BreadcrumbsProps } from './types';
import { useBreadcrumbs } from './hooks';

/**
 * Breadcrumbs Component
 *
 * Displays navigation breadcrumbs with Schema.org structured data.
 * Automatically includes home link and renders all path segments.
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Propiedades', href: '/real-estate' },
 *     { label: 'Vista del Mar' }
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { allItems, breadcrumbSchema } = useBreadcrumbs({ items });

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-1 text-gray-400" aria-hidden="true" />
                )}

                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {isFirst && <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className="hover:text-foreground transition-colors inline-flex items-center"
                  >
                    {isFirst && <Home className="h-4 w-4 mr-1" aria-hidden="true" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export * from './types';
