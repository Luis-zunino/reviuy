import * as React from 'react';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ContactEmailTemplate } from '@/components/common/Emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  let emailData;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set(name, value, options);
          },
          remove(name: string) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión para enviar un mensaje.' },
        { status: 401 }
      );
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'El formato del email es inválido' }, { status: 400 });
    }

    const loginEmail = user.email;

    if (!loginEmail) {
      return NextResponse.json({ error: 'El email de sesión no encontrado' }, { status: 403 });
    }

    emailData = {
      name,
      email,
      message,
      loginEmail,
    };
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando datos' }, { status: 400 });
  }

  const template = <ContactEmailTemplate {...emailData} />;

  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!, // TODO: corroborar esto
      to: [process.env.CONTACT_EMAIL!],
      replyTo: emailData.email,
      subject: `Nuevo mensaje de contacto - ${emailData.name}`,
      react: template,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    console.error('Error en POST /api/contact:', error);
    return NextResponse.json({ error: 'Error enviando el email' }, { status: 500 });
  }
}
