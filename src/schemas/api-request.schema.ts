import { z } from 'zod';

const reportReason = z
  .string({ message: 'El motivo es requerido' })
  .trim()
  .min(3, 'El motivo es demasiado corto')
  .max(120, 'El motivo no puede superar 120 caracteres');

const contactMessage = z
  .string({ message: 'El mensaje es requerido' })
  .trim()
  .min(5, 'El mensaje es demasiado corto')
  .max(2000, 'El mensaje no puede superar 2000 caracteres');

// Los reportes se guardan en description VARCHAR(500): un límite mayor hacía que
// la RPC fallara y el reporte no se guardara.
export const REPORT_MESSAGE_MAX_LENGTH = 500;

const reportMessage = z
  .string({ message: 'El mensaje es requerido' })
  .trim()
  .min(5, 'El mensaje es demasiado corto')
  .max(
    REPORT_MESSAGE_MAX_LENGTH,
    `El mensaje no puede superar ${REPORT_MESSAGE_MAX_LENGTH} caracteres`
  );

export const contactApiSchema = z.object({
  name: z
    .string({ message: 'El nombre es requerido' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  email: z
    .string({ message: 'El email es requerido' })
    .trim()
    .email('El formato del email es invalido'),
  message: contactMessage,
});

export const reportReviewApiSchema = z.object({
  reviewUuid: z.string().uuid('El identificador de reseña no es valido'),
  reason: reportReason,
  message: reportMessage,
});

export const reportRealEstateApiSchema = z.object({
  realEstateName: z
    .string({ message: 'El nombre de la inmobiliaria es requerido' })
    .trim()
    .min(2, 'El nombre de la inmobiliaria es demasiado corto')
    .max(120, 'El nombre de la inmobiliaria no puede superar 120 caracteres'),
  reason: reportReason,
  message: reportMessage,
});

export const reportRealEstateReviewApiSchema = z.object({
  realEstateReviewUuid: z.string().uuid('El identificador de reseña no es valido'),
  reason: reportReason,
  message: reportMessage,
});

export type ContactApiInput = z.infer<typeof contactApiSchema>;
export type ReportReviewApiInput = z.infer<typeof reportReviewApiSchema>;
export type ReportRealEstateApiInput = z.infer<typeof reportRealEstateApiSchema>;
export type ReportRealEstateReviewApiInput = z.infer<typeof reportRealEstateReviewApiSchema>;
