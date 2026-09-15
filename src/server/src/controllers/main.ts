import config from '@/config';
import type { RouteController } from '@/models/app.model';
import type { MainRoute } from '@/openapi/main';

import packageJSON from '../../package.json';

const mainController: RouteController<MainRoute> = (c) => {
  // Le doc sono montate su `${routesPrefix}/docs` (vedi utils/openApi.ts), non
  // sotto /v1: il valore pubblicizzato qui puntava a un path che si limita a
  // reindirizzare.
  const docs = config.development.isDev
    ? `${config.useHttps ? 'https' : 'http'}://${config.server.domain}:${
        config.server.port
      }${config.server.routesPrefix}/docs`
    : undefined;

  const authors = [...(packageJSON.contributors ?? [])];
  authors.unshift(packageJSON.author);

  return c.json({
    name: 'API Server - Kit Oratorio Estivo',
    version: packageJSON.version,
    authors,
    docs,
  });
};

export default mainController;
