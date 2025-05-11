import { HttpStatusCodes } from '@/codes';
import { shirtSchema } from '@/models/shirt.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getShirtListRouteDef = createRoute({
  tags: ['Shirt'],
  method: 'get',
  path: '/shirts',
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(shirtSchema),
      'List of shirts'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetShirtListRoute = typeof getShirtListRouteDef;
