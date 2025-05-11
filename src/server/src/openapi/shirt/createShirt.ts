import { HttpStatusCodes } from '@/codes';
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
  request: {
    body: createRequiredJsonBody(
      bodyShirtSchema.extend({
        isAvailable: z.boolean().optional(),
      }),
      'Data of the shirt size'
    ),
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
