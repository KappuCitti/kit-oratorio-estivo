import { classTable } from '@/database/schema/class';
import { schoolTable } from '@/database/schema/school';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const schoolListSchema = createSelectSchema(schoolTable).extend({
  classes: z.array(createSelectSchema(classTable).omit({ schoolId: true })),
});
export type SchoolList = z.infer<typeof schoolListSchema>;
