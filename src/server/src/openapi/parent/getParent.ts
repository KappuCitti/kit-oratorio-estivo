import { HttpStatusCodes } from '@/codes';
import { fullParentWithChildrenSchema } from '@/models/parent.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getParentInfoRouteDef = createRoute({
  tags: ['Family', 'Parent'],
  method: 'get',
  path: '/parents/{id}',
  request: {
    params: z.object({
      id: z.coerce.number().nonnegative(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      fullParentWithChildrenSchema,
      'Parent info'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Parent not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetParentInfoRoute = typeof getParentInfoRouteDef;
