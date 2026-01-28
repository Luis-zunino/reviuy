import * as React from 'react';
import { Html, Text, Section, Heading } from '@react-email/components';
import { ReportRealEstateTemplateProps } from './types';

export const ReportRealEstateTemplate: React.FC<Readonly<ReportRealEstateTemplateProps>> = async ({
  realEstateName,
  reason,
  message,
  loginEmail,
}) => (
  <Html lang="es">
    <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Heading as="h2">Nuevo mensaje de contacto</Heading>
      <Text>
        El usuario {loginEmail} a reportado a la inmobiliaria: <strong> {realEstateName}</strong>
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
