import * as React from 'react';
import { Html, Text, Section, Heading } from 'react-email';

interface ReportTemplateProps {
  reportedBy: string;
  reportedItem: string;
  reason: string;
  message?: string;
  loginEmail: string;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({
  reportedBy,
  reportedItem,
  reason,
  message,
  loginEmail,
}) => (
  <Html lang="es">
    <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Heading as="h2">Nuevo mensaje de contacto</Heading>
      <Text>
        El usuario {loginEmail} a reportado {reportedBy}: <strong> {reportedItem}</strong>
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
