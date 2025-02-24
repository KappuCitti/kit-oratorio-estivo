import { HttpStatusCodes } from '@/codes';
import { fullUserSchema } from '@/models/user.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const getUserInfoRouteDef = createRoute({
  tags: ['user'],
  method: 'get',
  path: '/user',
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      fullUserSchema,
      'User successfully registered'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: createJsonResBody(
      false,
      z.string(),
      'Token is invalid or has expired'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetUserInfoRoute = typeof getUserInfoRouteDef;
