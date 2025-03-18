import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteShirtRouteDef = createRoute({
  tags: ['Shirt'],
  method: 'delete',
  path: '/shirts/{id}',
  middleware: hasPermission('shirt_delete'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Shirt deleted successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Shirt not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type DeleteShirtRoute = typeof deleteShirtRouteDef;
