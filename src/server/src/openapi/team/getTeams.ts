import { HttpStatusCodes } from '@/codes';
import { isLogged } from '@/middlewares/isLogged';
import { teamSchema } from '@/models/team.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getTeamListRouteDef = createRoute({
  tags: ['Team'],
  method: 'get',
  path: '/teams',
  middleware: isLogged,
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(teamSchema),
      'List of teams'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetTeamListRoute = typeof getTeamListRouteDef;
