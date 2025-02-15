import type { OpenAPIHono } from '@hono/zod-openapi';

export interface HonoRoute {
  path: string;
  handler: OpenAPIHono<any, any, string>;
}
