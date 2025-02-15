import { z } from '@hono/zod-openapi';

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

export function createJsonResBody(
  success: boolean,
  data: z.ZodTypeAny,
  description: string
) {
  const schema = success
    ? z.object({ success: z.boolean(), data: data })
    : z.object({ success: z.boolean(), error: data });

  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
}
