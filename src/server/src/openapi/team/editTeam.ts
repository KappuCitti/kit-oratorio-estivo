import { HttpStatusCodes } from '@/codes';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editTeamRouteDef = createRoute({
  tags: ['Team'],
  method: 'post',
  path: '/teams/{id}',
  request: {
    params: z.object({
      id: z.number().int().positive(),
    }),
    body: createRequiredJsonBody(
      z.object({
        name: z.string().min(1).optional(),
        color: z
          .string()
          .regex(/(#[\da-f]{3})|(#[\da-f]{6})/i)
          .optional(),
        child: z.object({
          type: z.union([z.literal('SET'), z.literal('ADD')]),
          ids: z.array(z.number().int().positive()),
        }),
      }),
      'Data to modify'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Team modified successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more child ids are invalid'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Team not found'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Team name is already in use'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type EditTeamRoute = typeof editTeamRouteDef;
