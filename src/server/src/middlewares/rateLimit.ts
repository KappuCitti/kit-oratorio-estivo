import { HttpStatusCodes } from '@/codes';
import type { Bindings } from '@/models/app.model';
import { httpErrorResponse } from '@/utils/responses';
import type { Context, Next } from 'hono';

type Bucket = { count: number; resetAt: number };

export type RateLimitOptions = {
  /** Finestra di osservazione, in millisecondi. */
  windowMs: number;
  /** Richieste consentite per client dentro la finestra. */
  max: number;
};

/**
 * Rate limit in memoria, per processo.
 *
 * Volutamente senza dipendenze e senza Redis: il server gira come singola
 * istanza e l'obiettivo qui e' rendere impraticabile il credential stuffing su
 * /user/login, non costruire un limitatore distribuito. Se un giorno si scala
 * a piu' istanze, questo va sostituito con uno store condiviso.
 */
export function rateLimit({ windowMs, max }: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  return async (c: Context<Bindings, any, {}>, next: Next) => {
    const now = Date.now();

    // Pulizia opportunistica: senza questa la mappa cresce indefinitamente
    // sotto attacco, che e' esattamente quando non deve succedere.
    if (buckets.size > 10_000) {
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
    }

    const client =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
      c.req.header('x-real-ip') ||
      'unknown';

    const bucket = buckets.get(client);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(client, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count++;
    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      c.header('Retry-After', String(retryAfter));
      return httpErrorResponse(
        c,
        HttpStatusCodes.TOO_MANY_REQUESTS,
        'Too many attempts, try again later'
      );
    }

    return next();
  };
}
