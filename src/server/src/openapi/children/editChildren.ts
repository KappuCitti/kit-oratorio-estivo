import { HttpStatusCodes } from '@/codes';
import {
  bodyChildSchema,
  fullChildWithParentsSchema,
} from '@/models/children.model';
import { paramIdSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editChildRouteDef = createRoute({
  tags: ['Family', 'Children'],
  method: 'put',
  path: '/childs/{id}',
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(bodyChildSchema.partial(), 'Data to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, z.null(), 'Child updated'),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Child not found'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Child address is invalid'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type EditChildRoute = typeof editChildRouteDef;
