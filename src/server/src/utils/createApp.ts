import { logger } from '@/middlewares/logger';
import { OpenAPIHono } from '@hono/zod-openapi';
import serveEmojiFavicon from './emojiFavicon';
import type { Bindings } from '@/models/app.model';
import { configureOpenApi } from './openApi';
import config from '@/config';
import router from '@/router';
import { cors } from 'hono/cors';
import { parseZodError } from './parseZodError';

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

  app.notFound((h) => {
    return h.json({ message: 'Not found - ' + h.req.path }, 404);
  });

  app.onError((err, h) => {
    h.var.logger.error(err);
    return h.json({ message: 'Internal server error' }, 500);
  });

  configureOpenApi(app);
  app.use(
    config.routesPrefix + config.routesPrefix.endsWith('/') ? '*' : '/*',
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

  return app;
}
