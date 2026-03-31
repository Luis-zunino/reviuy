import type {
  ReportActionResponse,
  ReportRealEstateInput,
  ReportRealEstateReviewInput,
  ReportReviewInput,
} from '../contracts/report.types';

export interface ModerationCommandRepository {
  reportReview(input: ReportReviewInput): Promise<ReportActionResponse>;
  reportRealEstate(input: ReportRealEstateInput): Promise<ReportActionResponse>;
  reportRealEstateReview(input: ReportRealEstateReviewInput): Promise<ReportActionResponse>;
}
