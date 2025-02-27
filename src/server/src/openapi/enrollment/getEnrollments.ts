import { HttpStatusCodes } from '@/codes';
import { CLASSES } from '@/models/class.model';
import { bareEnrollmentSchema } from '@/models/enrollment.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentListRouteDef = createRoute({
  tags: ['enrollment'],
  method: 'get',
  path: '/enrollments',
  request: {
    query: z.object({
      page: z.coerce.number().int().gte(1).optional().default(1),
      size: z.coerce.number().int().positive().optional().default(25),
      year: z.coerce.number().int().positive(),
      weekId: z.coerce.number().int().positive().optional(),
      teemId: z.coerce.number().int().positive().optional(),
      query: z.string().max(100, 'Max query size reached').optional(),
      schoolType: z.enum(SCHOOL_TYPES).optional(),
      className: z.enum(CLASSES).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        enrollments: z.array(bareEnrollmentSchema),
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
