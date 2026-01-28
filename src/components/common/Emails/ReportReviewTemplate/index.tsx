import * as React from 'react';
import { Html, Text, Section, Heading } from '@react-email/components';
import { ReportReviewTemplateProps } from './types';

export const ReportReviewTemplate: React.FC<Readonly<ReportReviewTemplateProps>> = async ({
  reviewUuid,
  reason,
  message,
  loginEmail,
}) => (
  <Html lang="es">
    <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Heading as="h2">Nuevo mensaje de contacto</Heading>
      <Text>
        El usuario {loginEmail} a reportado a la opinion de la inmobiliaria:{' '}
        <strong> {reviewUuid}</strong>
      </Text>
      <Text>
        <strong>Razon:</strong>
      </Text>
      <Text>{reason}</Text>

      <Text>
        <strong>Mensaje:</strong>
      </Text>
      <Text>{message}</Text>
    </Section>
  </Html>
);
