import { z } from '@hono/zod-openapi';

export function createJsonBody<T extends z.ZodTypeAny>(
  schema: T,
  description: string
) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
}

export function createRequiredJsonBody<T extends z.ZodTypeAny>(
  schema: T,
  description: string
) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
    required: true,
  };
}

/**
 * Corpo di una risposta JSON: `{ success: true, data }` oppure
 * `{ success: false, error }`.
 *
 * `success` e' un parametro generico legato al letterale passato, non un
 * `boolean`. Con `boolean` TypeScript non puo' restringere il ternario, quindi
 * il tipo di ritorno diventava l'UNIONE delle due forme per ogni risposta
 * dell'API: a runtime il documento OpenAPI usciva giusto, perche' il booleano
 * e' reale, ma chiunque consumasse i tipi vedeva una risposta di successo in
 * cui il payload poteva stare sotto `data` oppure sotto `error`.
 */
export function createJsonResBody<T extends z.ZodTypeAny, S extends boolean>(
  success: S,
  data: T,
  description: string
): {
  content: {
    'application/json': {
      schema: S extends true
        ? z.ZodObject<{ success: z.ZodLiteral<true>; data: T }>
        : z.ZodObject<{ success: z.ZodLiteral<false>; error: T }>;
    };
  };
  description: string;
} {
  const schema = success
    ? z.object({ success: z.literal(true), data: data })
    : z.object({ success: z.literal(false), error: data });

  return {
    content: {
      'application/json': {
        schema: schema as any,
      },
    },
    description,
  };
}
