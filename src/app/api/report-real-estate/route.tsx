import { NextResponse } from 'next/server';
import { ReportRealEstateTemplate } from '@/components/common/Emails';
import { getAuthenticatedUser, parseAndValidateBody, sendEmail } from '../_utils';
import { AppError, createError, withRateLimit } from '@/lib';
import { reportRealEstateApiSchema } from '@/schemas';

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

    await withRateLimit(`api-report-real-estate:${user.id}`, 'sensitive');

    const body = await parseAndValidateBody(req, reportRealEstateApiSchema);
    const { realEstateName, reason, message } = body;

    if (!user.email) {
      throw createError('INVALID_INPUT', 'El email del usuario no se encontro');
    }

    await sendEmail({
      to: [process.env.CONTACT_EMAIL!],
      replyTo: user.email,
      subject: `Se ha reportado a: ${realEstateName}`,
      react: (
        <ReportRealEstateTemplate
          realEstateName={realEstateName}
          reason={reason}
          message={message}
          loginEmail={user.email}
        />
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

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
