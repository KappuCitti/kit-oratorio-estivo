import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { schoolListSchema } from '@/models/school.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createClassRouteDef = createRoute({
  tags: ['Class'],
  method: 'post',
  path: '/classes',
  middleware: can('manage_classes'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        name: z.string().min(2).max(100),
        schoolId: idSchema,
      }),
      'Data of class to add'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'Class successfully added'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Invalid school id'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Class already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateClassRoute = typeof createClassRouteDef;
