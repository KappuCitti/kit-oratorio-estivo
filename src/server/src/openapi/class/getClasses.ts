import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { classListSchema } from '@/models/class.model';
import { idSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getClassListRouteDef = createRoute({
  tags: ['Class'],
  method: 'get',
  path: '/classes',
  middleware: can('see_classes'),
  request: {
    query: z.object({
      schoolId: idSchema.optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(classListSchema),
      'List of classes'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetClassListRoute = typeof getClassListRouteDef;
