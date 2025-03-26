import type { Bindings } from '@/models/app.model';
import type { Context, Next } from 'hono';

export async function timeIt(c: Context<Bindings, any, {}>, next: Next) {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.var.logger.info(
    `${c.req.method} ${c.req.url} ${end - start}ms ${c.res.status}`
  );
}
