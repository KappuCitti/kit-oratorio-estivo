import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const loginRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/login',
  request: {
    body: createRequiredJsonBody(
      z.object({ username: z.string(), password: z.string() }),
      'Login credentials'
    ),
  },
  responses: {
    200: createJsonResBody(true, z.null(), 'Login successful'),
    400: createJsonResBody(false, z.string(), 'Missing username or password'),
    401: createJsonResBody(false, z.string(), 'Invalid username or password'),
    500: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type LoginRoute = typeof loginRouteDef;
