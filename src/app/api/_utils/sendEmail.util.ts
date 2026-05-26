import { Resend } from 'resend';
import * as React from 'react';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no está configurada');
  }
  return new Resend(apiKey);
}

type SendEmailParams = {
  to: string[];
  subject: string;
  replyTo?: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, replyTo, react }: SendEmailParams) {
  const resend = getResend();
  const fromEmail = process.env.FROM_EMAIL;
  if (!fromEmail) {
    throw new Error('FROM_EMAIL no está configurado');
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    replyTo,
    react,
  });

  if (error) {
    throw error;
  }
}
