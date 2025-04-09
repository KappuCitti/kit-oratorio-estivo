import { logger } from '@/middlewares/logger';
import { OpenAPIHono } from '@hono/zod-openapi';
import serveEmojiFavicon from './emojiFavicon';
import type { Bindings } from '@/models/app.model';
import { configureOpenApi } from './openApi';
import config from '@/config';
import router from '@/router';
import path from 'path';
import { cors } from 'hono/cors';
import { parseZodError } from './parseZodError';
import { httpErrorResponse } from './responses';
import { HttpStatusCodes } from '@/codes';
import { prefixJoin } from './joinPrefix';
import { serveStatic } from 'hono/serve-static';

export function createRouter() {
  return new OpenAPIHono<Bindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: false,
            error: parseZodError(result.error),
          },
          422
        );
      }
    },
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon('🚀'));

  app.use(logger());

  app.notFound((c) => {
    return httpErrorResponse(
      c,
      HttpStatusCodes.NOT_FOUND,
      'Not found - ' + c.req.method.toUpperCase() + ' ' + c.req.path
    );
  });

  app.use(
    '/static/*',
    serveStatic({
      root: path.join(__dirname, '../../global/'),
      getContent: async (path) => {
        return await Bun.file(path).text();
      },
    })
  );

  app.onError((err, c) => {
    c.var.logger.error(err.message, err);
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  const origin = `${config.useHttps ? 'https' : 'http'}://${
    config.server.domain
  }:${config.server.frontendPort}`;

  if (process.env.NODE_ENV !== 'production') {
    configureOpenApi(app);
  }

  app.use(
    prefixJoin('*'),
    cors({
      origin: [origin],
      credentials: true,
      allowHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
    })
  );

  const routers = router();
  for (const [key, router] of Object.entries(routers)) {
    app.route(prefixJoin(key), router);
  }

  app.get('*', (c) => {
    return c.redirect('/api/v1');
  });

  return app;
}
