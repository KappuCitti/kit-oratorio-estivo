import { classTable } from '@/database/schema/class';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { schoolListSchema } from './school.model';

export const classListSchema = createSelectSchema(classTable)
  .omit({
    schoolId: true,
  })
  .extend({
    school: schoolListSchema,
  });
export type ClassList = z.infer<typeof classListSchema>;
