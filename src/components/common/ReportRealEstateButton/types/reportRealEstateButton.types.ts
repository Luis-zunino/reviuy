import { type RealEstateWitheVotes } from '@/modules/real-estates';
import type { BaseButtonProps } from '../../types';

export interface ReportRealEstateButtonProps extends BaseButtonProps {
  realEstate: RealEstateWitheVotes;
}
