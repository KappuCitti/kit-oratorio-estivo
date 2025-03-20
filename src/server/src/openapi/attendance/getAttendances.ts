import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { bareAttendanceSchema } from '@/models/attendance.model';
import { queryPageSchema, querySizeSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getAttendaceListRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'get',
  path: '/attendances',
  middleware: hasPermission('attendance_get'),
  request: {
    query: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      page: queryPageSchema,
      size: querySizeSchema,
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(bareAttendanceSchema),
      'List of Attendances'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetAttendaceListRoute = typeof getAttendaceListRouteDef;
