import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { editAttendanceSchema } from '@/models/attendance.model';
import { idSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createAttendanceRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'post',
  path: '/attendances',
  middleware: hasPermission('attendance_update'),
  request: {
    body: createRequiredJsonBody(
      editAttendanceSchema,
      'Data of attendance to create'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'Attendance created successfully, returns id'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'There is already one attendance in the selected date with the specified enrollment id'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateAttendanceRoute = typeof createAttendanceRouteDef;
