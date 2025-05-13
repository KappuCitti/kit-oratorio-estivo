import type { db } from '@/database';
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

export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export type Transaction = Parameters<
  Parameters<(typeof db)['transaction']>[0]
>[0];
