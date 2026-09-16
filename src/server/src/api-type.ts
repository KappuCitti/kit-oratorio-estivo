import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Hono } from 'hono';
import type { v1Router } from '@/router';

/**
 * Punto d'ingresso usato per generare il contratto dell'API destinato al
 * client. Esporta solo un tipo: non contiene codice eseguibile.
 *
 * Dal router si estrae il solo schema delle rotte, scartando l'ambiente
 * (`Bindings`). Senza questo passaggio il contratto porterebbe con se' il tipo
 * del logger, e quindi obbligherebbe il client a dipendere da `hono-pino` e da
 * `@hono/zod-openapi` per una cosa che non lo riguarda. Cosi' l'unica
 * dipendenza che serve al client e' `hono`, che gli serve comunque per `hc`.
 *
 * Vedi scripts/generateClientApiType.ts.
 */
type Schema = typeof v1Router extends OpenAPIHono<any, infer S, any>
  ? S
  : never;

export type ApiType = Hono<any, Schema, '/'>;
