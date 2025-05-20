import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { schoolListSchema } from '@/models/school.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getSchoolListRouteDef = createRoute({
  tags: ['School'],
  method: 'get',
  path: '/schools',
  middleware: can('see_classes'),
  request: {
    query: z.object({
      query: z.string().max(100, 'Max query size reached').optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(schoolListSchema),
      'List of schools'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetSchoolListRoute = typeof getSchoolListRouteDef;
