import { HttpStatusCodes } from '@/codes';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const logoutRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/user/logout',
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Logout successful'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type LogoutRoute = typeof logoutRouteDef;
