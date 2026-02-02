import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string[];
  subject: string;
  replyTo?: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, replyTo, react }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    replyTo,
    react,
  });

  if (error) {
    throw error;
  }
}
