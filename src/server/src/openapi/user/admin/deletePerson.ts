import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deletePersonRouteDef = createRoute({
  tags: ['User'],
  method: 'delete',
  path: '/admin/people/{id}',
  middleware: can('manage_users'),
  request: {
    params: z.object({ id: cfSchema }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Person deleted successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Person not found'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'The person is the only manager of a minor'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeletePersonRoute = typeof deletePersonRouteDef;
