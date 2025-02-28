import { enrollmentWeeksTable, weekTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const weekSchema = createSelectSchema(weekTable);
export type Week = z.infer<typeof weekSchema>;

export const weekEnrollmentSchema = createSelectSchema(
  enrollmentWeeksTable
).omit({
  enrollmentId: true,
});
export type WeekEnrollment = z.infer<typeof weekEnrollmentSchema>;
