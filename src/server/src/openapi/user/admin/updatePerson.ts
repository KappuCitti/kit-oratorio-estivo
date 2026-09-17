import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema } from '@/models/common.model';
import { updatePersonSchema } from '@/models/person.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const updatePersonRouteDef = createRoute({
  tags: ['User'],
  method: 'put',
  path: '/admin/people/{id}',
  middleware: can('manage_users'),
  request: {
    params: z.object({ id: cfSchema }),
    body: createRequiredJsonBody(
      updatePersonSchema,
      'Fields of the person to modify'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Person modified successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Invalid role or nothing to change'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Person not found'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Email already used by another user'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type UpdatePersonRoute = typeof updatePersonRouteDef;
