import type { BaseButtonProps } from '../../types';

export interface BackButtonProps extends BaseButtonProps {
  handleOnClick?: () => void;
  fallbackUrl?: string;
}
