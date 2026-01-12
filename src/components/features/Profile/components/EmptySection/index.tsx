import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface EmptySectionProps {
  title: string;
  link: string;
  icon?: LucideIcon;
  description?: string;
}
export const EmptySection = (props: EmptySectionProps) => {
  const { title, link, icon: Icon, description } = props;
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-600 mb-4">{title}</p>
        <Link href={link} className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {description}
        </Link>
      </CardContent>
    </Card>
  );
};
