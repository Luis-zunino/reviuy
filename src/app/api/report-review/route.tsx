import { NextResponse } from 'next/server';
import { getAuthenticatedUser, parseAndValidateBody, sendEmail } from '../_utils';
import { ReportReviewTemplate } from '@/components/common/Emails';
import { AppError, createError, withRateLimit, RateLimitType } from '@/lib';
import { reportReviewApiSchema } from '@/schemas';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createReportReviewUseCase } from '@/modules/moderation/application';
import { SupabaseModerationCommandRepository } from '@/modules/moderation/infrastructure';

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
    const supabase = await createSupabaseServerClient();

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }

    const reportReviewUseCase = createReportReviewUseCase({
      getCurrentUserId: async () => user.id,
      rateLimit: async (key: string, scope: RateLimitType) => {
        await withRateLimit(key, scope);
      },
      repository: new SupabaseModerationCommandRepository(supabase),
    });

    const body = await parseAndValidateBody(req, reportReviewApiSchema);
    const { reviewUuid, reason, message } = body;

    await reportReviewUseCase({
      review_id: reviewUuid,
      reason,
      description: message,
    });

    if (!user.email) {
      throw createError('INVALID_INPUT', 'El email del usuario no se encontró');
    }

    await sendEmail({
      to: [process.env.CONTACT_EMAIL!],
      replyTo: user.email,
      subject: `Se ha reportado la opinión de la siguiente dirección: ${reviewUuid}`,
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
