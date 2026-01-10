import * as React from 'react';
import { Html, Text, Section, Heading } from '@react-email/components';
import { ContactEmailTemplateProps } from './types';

export const ContactEmailTemplate: React.FC<Readonly<ContactEmailTemplateProps>> = async ({
  name,
  email,
  message,
  loginEmail,
}) => (
  <Html lang="es">
    <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Heading>Hola, soy {name}!</Heading>
      <Heading as="h2">Nuevo mensaje de contacto</Heading>
      <Text>
        <strong>Email:</strong> {email}
      </Text>
      <Text>
        <strong>Email de login:</strong> {loginEmail}
      </Text>
      <Text>
        <strong>Mensaje:</strong>
      </Text>
      <Text>{message}</Text>
    </Section>
  </Html>
);
