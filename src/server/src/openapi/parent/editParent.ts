import { HttpStatusCodes } from '@/codes';
import { paramIdSchema } from '@/models/common.model';
import { bodyParentSchema } from '@/models/parent.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editParentRouteDef = createRoute({
  tags: ['Family', 'Parent'],
  method: 'put',
  path: '/parents/{id}',
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(bodyParentSchema, 'Parent data'),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Parent updated successfully'
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

export type EditParentRoute = typeof editParentRouteDef;
