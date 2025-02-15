import type { OpenAPIHono } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type HonoApp = OpenAPIHono<Bindings>;
