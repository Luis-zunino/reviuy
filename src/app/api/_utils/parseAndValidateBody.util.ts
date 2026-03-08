import { createError, handleZodError } from '@/lib';
import { z } from 'zod';

export async function parseAndValidateBody<TSchema extends z.ZodTypeAny>(
  req: Request,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    throw createError('INVALID_INPUT', 'El cuerpo de la solicitud debe ser JSON valido');
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw handleZodError(parsed.error);
  }

  return parsed.data;
}
