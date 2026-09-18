import { enrollmentWeeksTable } from '@/database/schema/enrollmentWeek';
import { weekTable } from '@/database/schema/week';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const weekSchema = createSelectSchema(weekTable);
export type Week = z.infer<typeof weekSchema>;

/**
 * Una settimana come la restituisce GET /weeks.
 *
 * - `isFull`: se ha esaurito i posti. E' l'unica informazione sui posti che
 *   vedono genitori e ragazzi: il limite si mostra solo quando e' superato.
 * - `enrolledCount`: quanti iscritti confermati; null per chi non e' un
 *   responsabile.
 * - `price`: null per il ragazzo a cui chi lo gestisce non mostra i prezzi.
 */
export const weekListItemSchema = weekSchema.extend({
  price: z.string().nullable(),
  isFull: z.boolean(),
  enrolledCount: z.number().int().nonnegative().nullable(),
});

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

