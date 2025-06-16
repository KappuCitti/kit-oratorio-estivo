import { HttpStatusCodes } from '@/codes';
import { fullUserSchema } from '@/models/user.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const getSelfInfoRouteDef = createRoute({
  tags: ['User'],
  method: 'get',
  path: '/users/self',
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, fullUserSchema, 'User data'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetSelfInfoRoute = typeof getSelfInfoRouteDef;
