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

export function createJsonResBody<T extends z.ZodTypeAny>(
  success: boolean,
  data: T,
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
