import { HttpStatusCodes } from '@/codes';
import { paramIdSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const deleteParentRouteDef = createRoute({
  tags: ['Family', 'Parent'],
  method: 'delete',
  path: '/parents/{id}',
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      z.object({
        deleteChildren: z.boolean().default(false),
      }),
      'Delete every child of the parent'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Parent deleted successfully'
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

export type DeleteParentRoute = typeof deleteParentRouteDef;
