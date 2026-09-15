import { logger } from '@/middlewares/logger';
import { OpenAPIHono } from '@hono/zod-openapi';
import serveEmojiFavicon from './emojiFavicon';
import type { Bindings } from '@/models/app.model';
import { configureOpenApi } from './openApi';
import config from '@/config';
import router from '@/router';
import path from 'path';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { parseZodError } from './parseZodError';
import { httpErrorResponse } from './responses';
import { HttpStatusCodes } from '@/codes';
import { prefixJoin } from './joinPrefix';
import { serveStatic } from 'hono/bun';
import { DatabaseError } from '@/errors/database';

export function createRouter() {
  return new OpenAPIHono<Bindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return httpErrorResponse(
          c,
          HttpStatusCodes.UNPROCESSABLE_ENTITY,
          parseZodError(result.error)
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
      rewriteRequestPath: (path) => path.replace('/static/', '/'),
    })
  );

  app.onError((err, c) => {
    if (DatabaseError.isDatabaseError(err)) {
      return err.toResponse(c);
    }
    // I middleware di Hono (csrf, bodyLimit, ...) segnalano il rifiuto con una
    // HTTPException che porta gia' il proprio status: senza questo ramo un 403
    // di CSRF arrivava al client come 500, nascondendo il motivo vero.
    if (err instanceof HTTPException) {
      return httpErrorResponse(c, err.status, err.message || 'Request refused');
    }
    c.var.logger.error(err.message, err);
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  // La porta va omessa quando e' quella di default dello schema: il browser
  // invia `Origin: https://esempio.it`, non `https://esempio.it:443`, quindi
  // includerla sempre faceva fallire il match e bloccava ogni richiesta con
  // credenziali in produzione.
  const scheme = config.useHttps ? 'https' : 'http';
  const defaultPort = config.useHttps ? 443 : 80;
  const originPort =
    config.server.frontendPort === defaultPort
      ? ''
      : `:${config.server.frontendPort}`;
  const origin = `${scheme}://${config.server.domain}${originPort}`;

  if (config.development.isDev) {
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

  // L'autenticazione e' basata su cookie con `credentials: true`: senza un
  // controllo dell'Origin, una pagina esterna puo' far partire richieste di
  // scrittura usando la sessione della vittima. SameSite=Lax non basta da solo.
  app.use(prefixJoin('*'), csrf({ origin }));

  app.use(
    prefixJoin('*'),
    secureHeaders({
      // L'API risponde solo JSON: nessuna risorsa da caricare.
      contentSecurityPolicy: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: config.useHttps
        ? 'max-age=31536000; includeSubDomains'
        : false,
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
