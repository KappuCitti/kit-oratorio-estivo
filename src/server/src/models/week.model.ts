import { enrollmentWeeksTable, weekTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const weekSchema = createSelectSchema(weekTable);
export type Week = z.infer<typeof weekSchema>;

export const weekEnrollmentSchema = createSelectSchema(enrollmentWeeksTable)
  .omit({
    enrollmentId: true,
    weekId: true,
  })
  .extend({
    id: z.number().int().positive(),
  });
export type WeekEnrollment = z.infer<typeof weekEnrollmentSchema>;

export const enrollmentWeekSchema = createSelectSchema(enrollmentWeeksTable);
export type EnrollmentWeek = z.infer<typeof enrollmentWeekSchema>;
