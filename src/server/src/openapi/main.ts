import { HttpStatusCodes } from '@/codes';
import { createJsonBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const mainRouteDef = createRoute({
  tags: ['Main'],
  method: 'get',
  path: '/',
  responses: {
    [HttpStatusCodes.OK]: createJsonBody(
      z.object({
        name: z.string(),
        version: z.string(),
        authors: z.array(z.string()),
        docs: z.string().optional()
      }),
      'API entry point'
    ),
  },
});

export type MainRoute = typeof mainRouteDef;
