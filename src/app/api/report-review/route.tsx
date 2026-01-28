import { NextResponse } from 'next/server';
import { getAuthenticatedUser, sendEmail } from '../utils';
import { ReportReviewTemplate, ReportReviewTemplateProps } from '@/components/common/Emails';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: ReportReviewTemplateProps = await req.json();
    const { reviewUuid, reason, message } = body;

    if (!reviewUuid || !reason || !message || !user.email) {
      throw new Error('Faltan campos obligatorios');
    }

    await sendEmail({
      to: [process.env.CONTACT_EMAIL!],
      replyTo: user.email,
      subject: `Se ha reportado la opinion de la siguiente direccion: ${reviewUuid}`,
      react: (
        <ReportReviewTemplate
          reviewUuid={reviewUuid}
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
