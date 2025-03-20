import { attendanceTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { idSchema } from './common.model';

export const bareAttendanceSchema = createSelectSchema(attendanceTable)
  .omit({
    date: true,
    enrollmentId: true,
  })
  .extend({
    id: z.union([idSchema, z.null()]),
    childId: idSchema,
    childName: z.string().max(255),
    childSurname: z.string().max(255),
  });
export type BareAttendance = z.infer<typeof bareAttendanceSchema>;
