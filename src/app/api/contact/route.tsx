import { NextResponse } from 'next/server';
import { ContactEmailTemplate } from '@/components/common/Emails';
import { getAuthenticatedUser, parseAndValidateBody, sendEmail } from '../_utils';
import { AppError, createError } from '@/lib';
import { contactApiSchema } from '@/schemas';

export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  );
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }
    const body = await parseAndValidateBody(req, contactApiSchema);
    const { name, email, message } = body;

    const loginEmail = user.email;

    if (!loginEmail) {
      throw createError('INVALID_INPUT', 'El email de sesión no se encontró');
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
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json({ error: 'Error procesando datos' }, { status: 500 });
  }
}
