import { HttpStatusCodes } from '@/codes';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createTeamRouteDef = createRoute({
  tags: ['Team'],
  method: 'post',
  path: '/teams',
  request: {
    body: createRequiredJsonBody(
      z.object({
        name: z.string().min(1),
        color: z.string().regex(/(#[\da-f]{3})|(#[\da-f]{6})/i),
      }),
      'Data of the team'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.number().int().positive(),
      'Team created successfully'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Team already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateTeamRoute = typeof createTeamRouteDef;
