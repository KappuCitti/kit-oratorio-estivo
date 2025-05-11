import { HttpStatusCodes } from '@/codes';
import { paramIdSchema } from '@/models/common.model';
import { bodyShirtSchema } from '@/models/shirt.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editShirtRouteDef = createRoute({
  tags: ['Shirt'],
  method: 'put',
  path: '/shirts/{id}',
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      bodyShirtSchema.partial(),
      'Data of the shirt to modify'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Shirt updated successfully'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Shirt not found'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Shirt size already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type EditShirtRoute = typeof editShirtRouteDef;
