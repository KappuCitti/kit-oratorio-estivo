import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { bodyShirtSchema } from '@/models/shirt.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createShirtRouteDef = createRoute({
  tags: ['Shirt'],
  method: 'post',
  path: '/shirts',
  middleware: hasPermission('shirt_add'),
  request: {
    body: createRequiredJsonBody(bodyShirtSchema, 'Data of the shirt size'),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'Shirt created successfully'
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

export type CreateShirtRoute = typeof createShirtRouteDef;
