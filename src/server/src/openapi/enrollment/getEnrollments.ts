import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import {
  coercedIdSchema,
  queryPageSchema,
  querySizeSchema,
} from '@/models/common.model';
import { bareEnrollmentSchema } from '@/models/enrollment.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentListRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'get',
  path: '/enrollments',
  middleware: can('see_users'),
  request: {
    query: z.object({
      page: queryPageSchema,
      size: querySizeSchema,
      year: z.coerce.number().int().positive(),
      weekId: coercedIdSchema.optional(),
      teamId: coercedIdSchema.optional(),
      query: z.string().max(100, 'Max query size reached').optional(),
      schoolType: z.number().int().positive().optional(),
      className: z.number().int().positive().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        elements: z.array(bareEnrollmentSchema),
        count: z.number().int().positive(),
      }),
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
