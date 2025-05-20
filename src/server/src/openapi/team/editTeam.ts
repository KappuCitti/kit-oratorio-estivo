import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { colorSchema, paramIdSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editTeamRouteDef = createRoute({
  tags: ['Team'],
  method: 'put',
  path: '/teams/{id}',
  middleware: can('manage_teams'),
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      z
        .object({
          name: z.string().min(1).max(255),
          color: colorSchema,
        })
        .partial(),
      'Data to edit'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Team edited successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Team does not exist'
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

export type EditTeamRoute = typeof editTeamRouteDef;
