import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { activityTableSchema } from '@/models/activity.model';
import {
  coercedIdSchema,
  queryPageSchema,
  querySizeSchema,
} from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getActivityListRouteDef = createRoute({
  tags: ['Activity'],
  method: 'get',
  path: '/activities',
  middleware: can('see_activities'),
  request: {
    query: z.object({
      page: queryPageSchema,
      size: querySizeSchema,
      query: z.string().max(100, 'Max query size reached').optional(),
      schoolId: coercedIdSchema.optional(),
      classId: coercedIdSchema.optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        elements: z.array(activityTableSchema),
        count: z.number().int().positive(),
      }),
      'List of activities'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetActivityListRoute = typeof getActivityListRouteDef;
