import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { bareAttendanceSchema } from '@/models/attendance.model';
import { CLASSES } from '@/models/class.model';
import {
  dateStringSchema,
  idSchema,
  queryPageSchema,
  querySizeSchema,
} from '@/models/common.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
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
      date: dateStringSchema,
      page: queryPageSchema,
      size: querySizeSchema,
      teamId: idSchema.optional(),
      className: z.enum(CLASSES).optional(),
      schoolType: z.enum(SCHOOL_TYPES).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        elements: z.array(bareAttendanceSchema),
        count: z.number().nonnegative().int(),
      }),
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
