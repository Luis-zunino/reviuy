import { NextResponse } from 'next/server';
import { ContactEmailTemplate, ContactEmailTemplateProps } from '@/components/common/Emails';
import { getAuthenticatedUser, sendEmail } from '../utils';
import { EMAIL_REGEX } from '@/constants';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const body: ContactEmailTemplateProps = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'El formato del email es inválido' }, { status: 400 });
    }

    const loginEmail = user.email;

    if (!loginEmail) {
      throw new Error('El email de sesión no encontrado');
    }

    await sendEmail({
      to: [process.env.CONTACT_EMAIL!],
      replyTo: user.email,
      subject: `Nuevo mensaje de contacto - ${name}`,
      react: (
        <ContactEmailTemplate name={name} email={email} message={message} loginEmail={loginEmail} />
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando datos' }, { status: 500 });
  }
}
