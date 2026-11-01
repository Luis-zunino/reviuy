import { NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  parseAndValidateBody,
  sendEmail,
  withErrorHandler,
  methodNotAllowed,
} from '../_utils';
import { ReportReviewTemplate } from '@/components/common/Emails';
import { createError } from '@/lib/errors';
import { withRateLimit, RateLimitType } from '@/lib/redis';
import { reportReviewApiSchema } from '@/schemas/api-request.schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createReportReviewUseCase } from '@/modules/moderation/application';
import { SupabaseModerationCommandRepository } from '@/modules/moderation/infrastructure';

export async function GET() {
  return methodNotAllowed();
}

export async function POST(req: Request) {
  return withErrorHandler(async () => {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw createError('UNAUTHORIZED', 'No autorizado');
    }

    if (!user.email) {
      throw createError('INVALID_INPUT', 'El email del usuario no se encontró');
    }

    const supabase = await createSupabaseServerClient();

    const body = await parseAndValidateBody(req, reportReviewApiSchema);
    const { reviewUuid, reason, message } = body;

    const reportReviewUseCase = createReportReviewUseCase({
      getCurrentUserId: async () => user.id,
      rateLimit: async (key: string, scope: RateLimitType) => {
        await withRateLimit(key, scope);
      },
      repository: new SupabaseModerationCommandRepository(supabase),
    });

    const result = await reportReviewUseCase({
      review_id: reviewUuid,
      reason,
      description: message,
    });

    // La RPC rechaza sin lanzar (duplicado, propia reseña, rate limit...): en ese
    // caso no se guardó el reporte y no se debe enviar el email.
    if (!result.success) {
      throw createError('VALIDATION_ERROR', result.message);
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
  });
}
