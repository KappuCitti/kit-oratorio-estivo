import { createRouter } from '@/utils/createApp';
import { createRoute, z } from '@hono/zod-openapi';

import packageJSON from '../../package.json';
import { createJsonBody } from '@/utils/createOpenApiBody';

const router = createRouter().openapi(
  createRoute({
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
  }),
  (c) => {
    return c.json({
      name: 'API Server - Kit Oratorio Estivo',
      version: packageJSON.version,
    });
  }
);

export default router;
