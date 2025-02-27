import { HttpStatusCodes } from '@/codes';
import { teamSchema } from '@/models/team.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getTeamListRouteDef = createRoute({
  tags: ['team'],
  method: 'get',
  path: '/teams',
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
