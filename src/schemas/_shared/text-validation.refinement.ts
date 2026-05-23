import { z } from 'zod';
import { validateText } from '@/utils/textValidation.util';

export const textValidationRefinement = (value: string | undefined, ctx: z.RefinementCtx) => {
  if (!value) return;
  const validation = validateText(value);
  if (!validation.isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validation.message,
    });
  }
};
