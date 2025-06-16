import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteAttendanceRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'delete',
  path: '/attendances/{id}',
  middleware: can('manage_attendances'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Attendance deleted successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Attendance not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteAttendanceRoute = typeof deleteAttendanceRouteDef;
