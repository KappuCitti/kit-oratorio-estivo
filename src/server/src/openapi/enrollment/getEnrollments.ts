import { HttpStatusCodes } from '@/codes';
import { bareEnrollmentSchema } from '@/models/enrollment.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentListRouteDef = createRoute({
  tags: ['enrollment'],
  method: 'get',
  path: '/enrollments',
  request: {
    query: z.object({
      page: z.number().int().gte(1).optional().default(1),
      size: z.number().int().positive().optional().default(25),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(bareEnrollmentSchema),
      'List of enrollments'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetEnrollmentListRoute = typeof getEnrollmentListRouteDef;
