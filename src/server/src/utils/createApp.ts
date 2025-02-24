import { logger } from '@/middlewares/logger';
import { OpenAPIHono } from '@hono/zod-openapi';
import serveEmojiFavicon from './emojiFavicon';
import type { Bindings } from '@/models/app.model';
import { configureOpenApi } from './openApi';
import config from '@/config';
import router from '@/router';
import { cors } from 'hono/cors';
import { parseZodError } from './parseZodError';
import { httpErrorResponse } from './responses';
import { HttpStatusCodes } from '@/codes';
import { prefixJoin } from './joinPrefix';

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

  app.onError((err, c) => {
    c.var.logger.error(err);
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  configureOpenApi(app);
  app.use(
    prefixJoin('*'),
    cors({
      origin: [
        'http://localhost',
        'https://localhost',
        'http://localhost:4200',
        'https://localhost:4200',
      ],
      credentials: true,
      allowHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
    })
  );

  app.route(config.routesPrefix, router());

  app.get('*', (c) => {
    return c.redirect('/api/v1');
  });

  return app;
}
