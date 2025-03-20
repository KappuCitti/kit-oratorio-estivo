import config from '@/config';
import type { RouteController } from '@/models/app.model';
import type { MainRoute } from '@/openapi/main';

import packageJSON from '../../package.json';

const mainController: RouteController<MainRoute> = (c) => {
  const docs =
    process.env.NODE_ENV !== 'production'
      ? `${config.useHttps ? 'https' : 'http'}://${config.server.domain}:${
          config.server.port
        }/api/v1/docs`
      : undefined;

  const authors = packageJSON.contributors ?? [];
  authors.unshift(packageJSON.author);

  return c.json({
    name: 'API Server - Kit Oratorio Estivo',
    version: packageJSON.version,
    authors,
    docs,
  });
};

export default mainController;
