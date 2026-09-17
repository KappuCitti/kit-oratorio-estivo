import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema } from '@/models/common.model';
import { personDetailSchema } from '@/models/person.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getPersonRouteDef = createRoute({
  tags: ['User'],
  method: 'get',
  path: '/admin/people/{id}',
  middleware: can('see_users'),
  request: {
    params: z.object({ id: cfSchema }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      personDetailSchema,
      'Person details'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Person not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetPersonRoute = typeof getPersonRouteDef;
