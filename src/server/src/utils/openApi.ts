import type { HonoApp } from '@/models/app.model';

import packageJSON from '../../package.json';
import { apiReference } from '@scalar/hono-api-reference';
import { prefixJoin } from './joinPrefix';

export function configureOpenApi(app: HonoApp) {
  app.doc(prefixJoin('/openapi'), {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Kit Oratorio Estivo',
    },
  });

  app.get(
    prefixJoin('/docs'),
    apiReference({
      theme: 'kepler',
      spec: {
        url: prefixJoin('/openapi'),
      },
    })
  );
}
