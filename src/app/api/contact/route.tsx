import * as React from 'react';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ContactEmailTemplate } from '@/components/common/Emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, loginEmail } = await req.json();

    if (!name || !email || !message || !loginEmail) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL!, // TODO: corregir esto
      to: [process.env.CONTACT_EMAIL!],
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${name}`,
      react: (
        <ContactEmailTemplate name={name} email={email} message={message} loginEmail={loginEmail} />
      ),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error enviando el email' }, { status: 500 });
  }
}
