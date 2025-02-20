import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const registerRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/register',
  request: {
    body: createRequiredJsonBody(
      z.object({ name: z.string(), surname: z.string(), password: z.string() }),
      'User info and password'
    ),
  },
  responses: {
    200: createJsonResBody(true, z.null(), 'User successfully registered'),
    400: createJsonResBody(false, z.string(), 'Missing registration data'),
    409: createJsonResBody(false, z.string(), 'User already exists'),
    500: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type RegisterRoute = typeof registerRouteDef;
