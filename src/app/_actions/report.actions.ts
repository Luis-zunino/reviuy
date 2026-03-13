'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  reportRealEstateApiSchema,
  reportRealEstateReviewApiSchema,
  reportReviewApiSchema,
} from '@/schemas';
import { createError, handleSupabaseError, withRateLimit } from '@/lib';

const reportReviewActionSchema = reportReviewApiSchema
  .omit({ reviewUuid: true, message: true })
  .extend({
    review_id: z.string().uuid('El identificador de reseña no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

const reportRealEstateActionSchema = reportRealEstateApiSchema
  .omit({ realEstateName: true, message: true })
  .extend({
    real_estate_id: z.string().uuid('El identificador de inmobiliaria no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

const reportRealEstateReviewActionSchema = reportRealEstateReviewApiSchema
  .omit({ realEstateReviewUuid: true, message: true })
  .extend({
    review_id: z.string().uuid('El identificador de reseña no es valido'),
    description: z
      .string()
      .trim()
      .max(2000, 'El mensaje no puede superar 2000 caracteres')
      .optional(),
  });

type ReportActionResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export async function reportReviewAction(input: unknown): Promise<ReportActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  await withRateLimit(`report-review:${user.id}`, 'sensitive');

  const payload = reportReviewActionSchema.parse(input);

  const { error } = await supabase.rpc('report_review', {
    p_review_id: payload.review_id,
    p_reason: payload.reason,
    p_description: payload.description,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return {
    success: true,
    message: 'Reporte enviado',
  };
}

export async function reportRealEstateAction(input: unknown): Promise<ReportActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  await withRateLimit(`report-real-estate:${user.id}`, 'sensitive');

  const payload = reportRealEstateActionSchema.parse(input);

  const { error } = await supabase.rpc('report_real_estate', {
    p_real_estate_id: payload.real_estate_id,
    p_reason: payload.reason,
    p_description: payload.description,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return {
    success: true,
    message: 'Reporte enviado',
  };
}

export async function reportRealEstateReviewAction(input: unknown): Promise<ReportActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw createError('UNAUTHORIZED');
  }

  await withRateLimit(`report-real-estate-review:${user.id}`, 'sensitive');

  const payload = reportRealEstateReviewActionSchema.parse(input);

  const { error } = await supabase.rpc('report_real_estate_review', {
    p_real_estate_review_id: payload.review_id,
    p_reason: payload.reason,
    p_description: payload.description,
  });

  if (error) {
    throw handleSupabaseError(error);
  }

  return {
    success: true,
    message: 'Reporte enviado',
  };
}
