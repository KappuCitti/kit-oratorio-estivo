import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { editAttendanceSchema } from '@/models/attendance.model';
import { paramIdSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editAttendanceRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'put',
  path: '/attendances/{id}',
  middleware: hasPermission('attendance_update'),
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      editAttendanceSchema.partial(),
      'Data of attendance to create'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Attendance updated successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Attendance not found'
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

export type EditAttendanceRoute = typeof editAttendanceRouteDef;
