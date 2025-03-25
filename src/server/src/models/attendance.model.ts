import { attendanceTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { dateStringSchema, idSchema } from './common.model';

export const attendanceSchema = createSelectSchema(attendanceTable);
export type Attendance = z.infer<typeof attendanceSchema>;

export const bareAttendanceSchema = attendanceSchema
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

export const editAttendanceSchema = attendanceSchema
  .extend({
    date: dateStringSchema,
  })
  .omit({
    id: true,
  });
export type EditAttendance = z.infer<typeof editAttendanceSchema>;
