import { createJsonBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const mainRouteDef = createRoute({
  tags: ['main'],
  method: 'get',
  path: '/',
  responses: {
    200: createJsonBody(
      z.object({
        name: z.string(),
        version: z.string(),
      }),
      'API entry point'
    ),
  },
});

export type MainRoute = typeof mainRouteDef;