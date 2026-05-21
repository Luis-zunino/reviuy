'use server';

import { createServerActionDeps } from '@/shared/auth/create-server-action-deps.util';
import { createError } from '@/lib/errors';
import { SupabaseReviewImageRepository } from '../infrastructure/repositories/supabase-review-image.repository';
import { processImageForUpload } from '@/lib/storage';
import {
  ALLOWED_MIME_TYPES,
  MAX_INPUT_FILE_SIZE_BYTES,
  MAX_OUTPUT_FILE_SIZE_BYTES,
} from '@/constants/review-images.constants';

export async function uploadReviewImageAction(reviewId: string, osmId: string, formData: FormData) {
  const { supabase, rateLimit } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión para subir imágenes.');
  const userId = user.id;

  await rateLimit(`upload_review_image:${userId}`, 'write');

  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw createError('INVALID_INPUT', 'No se recibió ningún archivo.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw createError('INVALID_INPUT', 'Solo se permiten imágenes JPG, PNG o WebP.');
  }

  if (file.size > MAX_INPUT_FILE_SIZE_BYTES) {
    throw createError('INVALID_INPUT', 'El archivo no puede superar los 15 MB.');
  }

  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const processedImage = await processImageForUpload({
    buffer: originalBuffer,
    filename: file.name,
  });

  if (processedImage.buffer.length > MAX_OUTPUT_FILE_SIZE_BYTES) {
    throw createError(
      'INVALID_INPUT',
      'La imagen optimizada sigue siendo muy pesada. Probá con una imagen de menor resolución.'
    );
  }

  const repository = new SupabaseReviewImageRepository(supabase);

  return repository.upload({
    reviewId,
    osmId,
    file: processedImage.buffer,
    filename: processedImage.filename,
    contentType: processedImage.contentType,
  });
}

export async function deleteReviewImageAction(imageId: string, reviewId: string) {
  const { supabase } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión para eliminar imágenes.');

  const repository = new SupabaseReviewImageRepository(supabase);

  return repository.delete({ imageId, reviewId });
}

export async function getReviewImagesAction(reviewId: string) {
  const { supabase } = await createServerActionDeps();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw createError('UNAUTHORIZED', 'Debés iniciar sesión para ver imágenes.');

  const repository = new SupabaseReviewImageRepository(supabase);

  return repository.getByReviewId({ reviewId });
}
