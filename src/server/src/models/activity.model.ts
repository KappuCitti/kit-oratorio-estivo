import { activityTable } from '@/database/schema/activities';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const activityTableSchema = createSelectSchema(activityTable);
export type Activity = z.infer<typeof activityTableSchema>;
