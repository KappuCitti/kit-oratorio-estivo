import type { db } from '@/database';
import { z } from 'zod';

export const idSchema = z.number().int().positive();
export const coercedIdSchema = z.coerce.number().int().positive();

export const paramIdSchema = z.object({
  id: coercedIdSchema,
});

export const colorSchema = z.string().regex(/(#[\da-f]{3})|(#[\da-f]{6})/i);

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

export const phoneSchema = z
  .string()
  .regex(/^(\+?\d{1,3})?\s?\d{3}\s?\d{3}\s?\d{4}$/);

export type Prettify<T extends Object> = {
  [K in keyof T]: T[K] extends Object ? Prettify<T[K]> : T[K];
} & {};

export const cfSchema = z.string().length(16);
