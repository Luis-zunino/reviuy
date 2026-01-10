import { TEXT_VARIANT } from '../../constants';

export interface UseNavBarItemProps {
  pageUrl?: string;
  variant: keyof typeof TEXT_VARIANT;
}
