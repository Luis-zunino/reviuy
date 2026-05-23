import { NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';

export async function withErrorHandler(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
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

export function methodNotAllowed(allowed?: string) {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: `This endpoint only accepts ${allowed ?? 'POST'} requests`,
    },
    { status: 405 }
  );
}
