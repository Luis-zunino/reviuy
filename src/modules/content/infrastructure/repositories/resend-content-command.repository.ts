import { ContactEmailTemplate } from '@/components/common/Emails';
import { createError } from '@/lib';
import { sendEmail } from '@/app/api/_utils';
import { createElement } from 'react';
import type {
  ContentCommandRepository,
  ContactEmailPayload,
  SendContactMessageOutput,
} from '../../domain';

export class ResendContentCommandRepository implements ContentCommandRepository {
  async sendContactMessage(payload: ContactEmailPayload): Promise<SendContactMessageOutput> {
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      throw createError('INTERNAL_ERROR', 'Email de contacto no configurado.');
    }

    await sendEmail({
      to: [contactEmail],
      replyTo: payload.replyTo,
      subject: `Nuevo mensaje de contacto - ${payload.name}`,
      react: createElement(ContactEmailTemplate, {
        name: payload.name,
        email: payload.email,
        message: payload.message,
        loginEmail: payload.loginEmail,
      }),
    });

    return { success: true };
  }
}
