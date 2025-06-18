import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema, idSchema } from '@/models/common.model';
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
  middleware: can('manage_attendances'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        userId: cfSchema,
        date: z.string().date(),
        eatsInOratory: z.boolean().default(false),
      }),
      'Data of the attendance to create'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'Attendance edited successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid or fields are empty'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Attendance already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateAttendanceRoute = typeof createAttendanceRouteDef;
