import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteEnrollmentRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'delete',
  path: '/enrollments/{id}',
  // La rotta era senza middleware: chiunque avrebbe potuto cancellare
  // l'iscrizione di un minore sapendone l'id.
  middleware: can('manage_enrollments'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Enrollment deleted successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Enrollment not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteEnrollmentRoute = typeof deleteEnrollmentRouteDef;
