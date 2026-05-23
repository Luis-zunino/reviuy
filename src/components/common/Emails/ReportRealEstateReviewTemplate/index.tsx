import * as React from 'react';
import { ReportTemplate } from '@/components/common/Emails/ReportTemplate';
import { ReportRealEstateReviewTemplateProps } from './types';

export const ReportRealEstateReviewTemplate: React.FC<
  Readonly<ReportRealEstateReviewTemplateProps>
> = async ({ realEstateReviewUuid, reason, message, loginEmail }) => (
  <ReportTemplate
    reportedBy="a la opinion de la inmobiliaria"
    reportedItem={realEstateReviewUuid}
    reason={reason}
    message={message}
    loginEmail={loginEmail}
  />
);
