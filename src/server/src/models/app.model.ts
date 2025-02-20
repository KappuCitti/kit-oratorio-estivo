import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type HonoApp = OpenAPIHono<Bindings>;

export type RouteController<T extends RouteConfig> = RouteHandler<T, Bindings>;
