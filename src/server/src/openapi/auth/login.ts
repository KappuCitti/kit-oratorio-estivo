import { HttpStatusCodes } from '@/codes';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const loginRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/user/login',
  request: {
    body: createRequiredJsonBody(
      z.object({ username: z.string(), password: z.string() }),
      'Login credentials'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, z.null(), 'Login successful'),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Missing username or password'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: createJsonResBody(
      false,
      z.string(),
      'Invalid username or password'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type LoginRoute = typeof loginRouteDef;
