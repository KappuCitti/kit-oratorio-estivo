import { HttpStatusCodes } from '@/codes';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteChildRouteDef = createRoute({
  tags: ['Family', 'Children'],
  method: 'delete',
  path: '/childs/{id}',
  request: {
    params: z.object({
      id: z.coerce.number().int().nonnegative(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Child informations'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Child not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteChildRoute = typeof deleteChildRouteDef;
