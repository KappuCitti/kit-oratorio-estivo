import { HttpStatusCodes } from '@/codes';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteTeamRouteDef = createRoute({
  tags: ['Team'],
  method: 'delete',
  path: '/teams/{id}',
  request: {
    params: z.object({
      id: z.coerce.number().int().nonnegative(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Team deleted successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Team does not exist'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteTeamRoute = typeof deleteTeamRouteDef;
