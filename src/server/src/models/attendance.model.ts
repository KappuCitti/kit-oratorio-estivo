import { attendanceTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { dateStringSchema, idSchema } from './common.model';

export const bareAttendanceSchema = createSelectSchema(attendanceTable)
  .omit({
    date: true,
  })
  .extend({
    id: z.union([idSchema, z.null()]),
    childId: idSchema,
    childName: z.string().max(255),
    childSurname: z.string().max(255),
  });
export type BareAttendance = z.infer<typeof bareAttendanceSchema>;

export const editAttendanceSchema = createSelectSchema(attendanceTable)
  .extend({
    date: dateStringSchema,
  })
  .omit({
    id: true,
  });
export type EditAttendance = z.infer<typeof editAttendanceSchema>;
