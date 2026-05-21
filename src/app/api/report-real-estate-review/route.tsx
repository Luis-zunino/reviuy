import { NextResponse } from 'next/server';
import { ReportRealEstateReviewTemplate } from '@/components/common/Emails';
import { getAuthenticatedUser, parseAndValidateBody, sendEmail } from '../_utils';
import { AppError, createError } from '@/lib/errors';
import { withRateLimit, RateLimitType } from '@/lib/redis';
import { reportRealEstateReviewApiSchema } from '@/schemas/api-request.schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createReportRealEstateReviewUseCase } from '@/modules/moderation/application';
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

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }

    if (!user.email) {
      throw createError('INVALID_INPUT', 'El email del usuario no se encontro');
    }

    const supabase = await createSupabaseServerClient();

    const body = await parseAndValidateBody(req, reportRealEstateReviewApiSchema);
    const { realEstateReviewUuid, reason, message } = body;

    const reportRealEstateReviewUseCase = createReportRealEstateReviewUseCase({
      getCurrentUserId: async () => user.id,
      rateLimit: async (key: string, scope: RateLimitType) => {
        await withRateLimit(key, scope);
      },
      repository: new SupabaseModerationCommandRepository(supabase),
    });

    await reportRealEstateReviewUseCase({
      review_id: realEstateReviewUuid,
      reason,
      description: message,
    });

    await sendEmail({
      to: [process.env.CONTACT_EMAIL!],
      replyTo: user.email,
      subject: `Se ha reportado la opinion: ${realEstateReviewUuid}`,
      react: (
        <ReportRealEstateReviewTemplate
          realEstateReviewUuid={realEstateReviewUuid}
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
