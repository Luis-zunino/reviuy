import * as React from 'react';
import { ReportTemplate } from '@/components/common/Emails/ReportTemplate';
import { ReportRealEstateTemplateProps } from './types';

export const ReportRealEstateTemplate: React.FC<Readonly<ReportRealEstateTemplateProps>> = async ({
  realEstateName,
  reason,
  message,
  loginEmail,
}) => (
  <ReportTemplate
    reportedBy="a la inmobiliaria"
    reportedItem={realEstateName}
    reason={reason}
    message={message}
    loginEmail={loginEmail}
  />
);
