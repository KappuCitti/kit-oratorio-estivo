import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteQueueEnrollmentRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'delete',
  path: '/enrollments/queue/{id}',
  middleware: can('manage_enrollments'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Enrollment request rejected'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Enrollment request not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteQueueEnrollmentRoute = typeof deleteQueueEnrollmentRouteDef;
