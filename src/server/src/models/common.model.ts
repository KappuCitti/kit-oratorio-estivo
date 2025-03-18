import { z } from 'zod';

export const idSchema = z.number().int().nonnegative();
export const coercedIdSchema = z.coerce.number().int().nonnegative();

export const paramIdSchema = z.object({
  id: coercedIdSchema,
});