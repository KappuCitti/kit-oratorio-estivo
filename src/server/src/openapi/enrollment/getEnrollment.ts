import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { enrollmentDetailSchema } from '@/models/enrollment.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentInfoRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'get',
  path: '/enrollments/{id}',
  // La rotta era senza middleware: chiunque, anche senza sessione, avrebbe
  // potuto leggere l'iscrizione di un minore sapendone l'id.
  middleware: can('see_users'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      enrollmentDetailSchema,
      'Enrollment informations'
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

export type GetEnrollmentInfoRoute = typeof getEnrollmentInfoRouteDef;
