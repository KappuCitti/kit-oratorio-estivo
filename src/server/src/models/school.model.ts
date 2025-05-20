import { schoolTable } from '@/database/schema/school';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const schoolListSchema = createSelectSchema(schoolTable);
export type SchoolList = z.infer<typeof schoolListSchema>;
