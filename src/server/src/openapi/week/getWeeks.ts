import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { weekSchema } from '@/models/week.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getWeekListRouteDef = createRoute({
  tags: ['Week'],
  method: 'get',
  path: '/weeks',
  middleware: hasPermission('week_get'),
  request: {
    query: z.object({
      year: z.coerce.number().int().positive(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(weekSchema),
      'List of weeks for the given year'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetWeekListRoute = typeof getWeekListRouteDef;
