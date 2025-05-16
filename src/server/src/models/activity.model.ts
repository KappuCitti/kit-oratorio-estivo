import { activityTable } from '@/database/schema/activities';
import { activityAppointmentTable } from '@/database/schema/activityAppointments';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const activityTableSchema = createSelectSchema(activityTable);
export type Activity = z.infer<typeof activityTableSchema>;

export const activityWeekSchema = createSelectSchema(
  activityAppointmentTable
).omit({ activityId: true });
export type ActivityWeek = z.infer<typeof activityWeekSchema>;
