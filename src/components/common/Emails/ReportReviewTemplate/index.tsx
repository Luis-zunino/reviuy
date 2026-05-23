import * as React from 'react';
import { ReportTemplate } from '@/components/common/Emails/ReportTemplate';
import { ReportReviewTemplateProps } from './types';

export const ReportReviewTemplate: React.FC<Readonly<ReportReviewTemplateProps>> = async ({
  reviewUuid,
  reason,
  message,
  loginEmail,
}) => (
  <ReportTemplate
    reportedBy="a la opinion de la inmobiliaria"
    reportedItem={reviewUuid}
    reason={reason}
    message={message}
    loginEmail={loginEmail}
  />
);
