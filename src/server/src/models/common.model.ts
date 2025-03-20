import { z } from 'zod';

export const idSchema = z.number().int().nonnegative();
export const coercedIdSchema = z.coerce.number().int().nonnegative();

export const paramIdSchema = z.object({
  id: coercedIdSchema,
});

export const queryPageSchema = z.coerce.number().int().positive().default(1);
export const querySizeSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(200)
  .default(25);
