import { LucideIcon } from 'lucide-react';

export interface NavBarItemProps {
  pageUrl?: string;
  icon?: LucideIcon;
  label: string;
  variant?: 'default' | 'destructive';
  onClick?: () => void;
  showInDesktop?: boolean;
}
