import { LucideIcon } from 'lucide-react';
import { TEXT_VARIANT } from '../constants';

export interface NavBarItemProps {
  pageUrl?: string;
  Icon?: LucideIcon;
  label: string;
  variant?: keyof typeof TEXT_VARIANT;
  onClick?: () => void;
  showInDesktop?: boolean;
}
