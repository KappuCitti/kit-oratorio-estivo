import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { bodyFamilySchema } from '@/models/family.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createFamilyRouteDef = createRoute({
  tags: ['Family'],
  method: 'post',
  path: '/family',
  middleware: hasPermission('tree_add'),
  request: {
    body: createRequiredJsonBody(
      bodyFamilySchema,
      'Family containing children and parents'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        parents: z.array(idSchema).min(1),
        childs: z.array(idSchema).min(1),
        enrollments: z.array(idSchema),
      }),
      'Family created successfully, returns ids of created children, parents and enrollments'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateFamilyRoute = typeof createFamilyRouteDef;
