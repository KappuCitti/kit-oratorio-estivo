import { HttpStatusCodes } from '@/codes';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const logoutRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/logout',
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, z.null(), 'Login successful'),
  },
});

export type LogoutRoute = typeof logoutRouteDef;
