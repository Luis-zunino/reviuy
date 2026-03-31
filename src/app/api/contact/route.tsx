import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../_utils';
import { AppError, createError, withRateLimit, RateLimitType } from '@/lib';
import { createSendContactMessageUseCase } from '@/modules/content/application';
import { ResendContentCommandRepository } from '@/modules/content/infrastructure';

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

    const sendContactMessageUseCase = createSendContactMessageUseCase({
      getCurrentUser: async () => ({
        id: user.id,
        email: user.email ?? null,
      }),
      rateLimit: async (key: string, scope: RateLimitType) => {
        await withRateLimit(key, scope);
      },
      contentCommandRepository: new ResendContentCommandRepository(),
    });

    await sendContactMessageUseCase(await req.json());

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
