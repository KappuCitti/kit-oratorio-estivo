import type { HonoApp } from '@/models/app.model';

import packageJSON from '../../package.json';
import { apiReference } from '@scalar/hono-api-reference';

export function configureOpenApi(app: HonoApp) {
  app.doc('/openapi', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Kit Oratorio Estivo',
    },
  });

  app.get(
    '/docs',
    apiReference({
      theme: 'kepler',
      spec: {
        url: '/openapi',
      },
    })
  );
}
