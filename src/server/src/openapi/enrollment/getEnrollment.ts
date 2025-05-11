import { HttpStatusCodes } from '@/codes';
import { paramIdSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentInfoRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'get',
  path: '/enrollments/{id}',
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      // fullEnrollmentWithFamilySchema,
      // TODO: Create type
      z.null(),
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
