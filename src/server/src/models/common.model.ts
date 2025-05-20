import type { db } from '@/database';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';
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

export type ColumnType<TCol extends MySqlColumn> =
  TCol['_']['notNull'] extends true
    ? TCol['_']['data']
    : TCol['_']['hasDefault'] extends true
    ? TCol['_']['data']
    : TCol['_']['data'] | null | undefined;

export const phoneSchema = z
  .string()
  .regex(/^(\+?\d{1,3})?\s?\d{3}\s?\d{3}\s?\d{4}$/);
