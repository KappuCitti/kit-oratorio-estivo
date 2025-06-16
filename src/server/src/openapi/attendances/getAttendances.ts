import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { attendanceSchema } from '@/models/attendance.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getAttendanceListRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'get',
  path: '/attendances',
  middleware: can('manage_attendances'),
  request: {
    query: z.object({
      date: z.string().date(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(attendanceSchema),
      'List of attendances'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetAttendanceListRoute = typeof getAttendanceListRouteDef;
