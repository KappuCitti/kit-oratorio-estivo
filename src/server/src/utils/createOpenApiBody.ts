import type { z } from '@hono/zod-openapi';

export function createJsonBody(schema: z.ZodTypeAny, description: string) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
}
