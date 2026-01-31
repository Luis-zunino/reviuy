import { NextResponse } from 'next/server';
import {
  ReportRealEstateTemplate,
  ReportRealEstateTemplateProps,
} from '@/components/common/Emails';
import { getAuthenticatedUser, sendEmail } from '../_utils';

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
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: ReportRealEstateTemplateProps = await req.json();
    const { realEstateName, reason, message } = body;

    if (!realEstateName || !reason || !message || !user.email) {
      throw new Error('Faltan campos obligatorios');
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
