import { createError } from '@/lib/errors';
import { uploadImage, deleteImage } from '@/lib/storage';
import type { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  ReviewImageRepository,
  UploadReviewImageInput,
  UploadReviewImageResult,
  DeleteReviewImageInput,
  DeleteReviewImageResult,
  GetReviewImagesInput,
  GetReviewImagesOutput,
  ReviewImage,
} from '../../domain';

const MAX_IMAGES_PER_REVIEW = 5;

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export class SupabaseReviewImageRepository implements ReviewImageRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async upload(input: UploadReviewImageInput): Promise<UploadReviewImageResult> {
    // Verificar que la reseña existe y pertenece al usuario actual
    const { data: review, error: reviewError } = await this.supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', input.reviewId)
      .single();

    if (reviewError || !review) {
      throw createError('NOT_FOUND', 'Reseña no encontrada.');
    }

    // Verificar límite de imágenes
    const { count, error: countError } = await this.supabase
      .from('review_images')
      .select('id', { count: 'exact', head: true })
      .eq('review_id', input.reviewId);

    if (countError) {
      throw createError('INTERNAL_ERROR', 'Error al verificar el límite de imágenes.');
    }

    if ((count ?? 0) >= MAX_IMAGES_PER_REVIEW) {
      throw createError(
        'VALIDATION_ERROR',
        `El límite máximo es ${MAX_IMAGES_PER_REVIEW} imágenes por reseña.`
      );
    }

    const ext = input.filename.split('.').pop() ?? 'jpg';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `reviews/${input.osmId}/${input.reviewId}/${uniqueName}`;

    const { url } = await uploadImage({ path, file: input.file, contentType: input.contentType });

    const { data: image, error: insertError } = await this.supabase
      .from('review_images')
      .insert({ review_id: input.reviewId, url, path, order: count ?? 0 })
      .select()
      .single();

    if (insertError || !image) {
      // Si falla el insert en Supabase, intentar borrar el archivo ya subido a R2
      await deleteImage(path).catch(() => null);
      throw createError('INTERNAL_ERROR', 'Error al guardar la imagen.');
    }

    return { success: true, message: 'Imagen subida correctamente.', data: image as ReviewImage };
  }

  async delete(input: DeleteReviewImageInput): Promise<DeleteReviewImageResult> {
    const { data: image, error: fetchError } = await this.supabase
      .from('review_images')
      .select('id, path, review_id')
      .eq('id', input.imageId)
      .eq('review_id', input.reviewId)
      .single();

    if (fetchError || !image) {
      throw createError('NOT_FOUND', 'Imagen no encontrada.');
    }

    // Primero borrar del bucket para no dejar huérfanos
    await deleteImage(image.path);

    const { error: deleteError } = await this.supabase
      .from('review_images')
      .delete()
      .eq('id', input.imageId);

    if (deleteError) {
      throw createError('INTERNAL_ERROR', 'Error al eliminar el registro de la imagen.');
    }

    return { success: true, message: 'Imagen eliminada.' };
  }

  async getByReviewId(input: GetReviewImagesInput): Promise<GetReviewImagesOutput> {
    const { data, error } = await this.supabase
      .from('review_images')
      .select('*')
      .eq('review_id', input.reviewId)
      .order('order', { ascending: true });

    if (error) {
      throw createError('INTERNAL_ERROR', 'Error al obtener las imágenes.');
    }

    return (data ?? []) as ReviewImage[];
  }
}
