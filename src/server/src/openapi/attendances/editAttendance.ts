import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
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
  middleware: can('manage_attendances'),
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      z
        .object({
          date: z.string().date(),
          eatsInOratory: z.boolean(),
        })
        .partial(),
      'Data of the attendance to edit'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Attendance edited successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid or fields are empty'
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

export type EditAttendanceRoute = typeof editAttendanceRouteDef;
