import { attendanceTable } from '@/database/schema/attendance';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { cfSchema } from './common.model';

export const attendanceSchema = createSelectSchema(attendanceTable)
  .omit({
    date: true,
  })
  .extend({
    user: z.object({
      id: cfSchema,
      name: z.string(),
      surname: z.string(),
    }),
  });
export type Attendance = z.infer<typeof attendanceSchema>;
