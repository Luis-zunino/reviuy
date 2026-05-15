import { RateLimitType } from '@/lib';
import { RealEstateCommandRepository } from '@/modules/real-estates/domain';

export interface RealEstateCommandoBase {
  getCurrentUserId: () => Promise<string | null>;
  rateLimit: (key: string, scope: RateLimitType) => Promise<void>;
  repository: RealEstateCommandRepository;
}
