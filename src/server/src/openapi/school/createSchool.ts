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

export const createSchoolRouteDef = createRoute({
  tags: ['School'],
  method: 'post',
  path: '/schools',
  middleware: can('manage_classes'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        name: z.string().min(2).max(100),
        canChooseActivities: z.boolean(),
      }),
      'Data of school to add'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'School successfully added'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'School already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateSchoolRoute = typeof createSchoolRouteDef;
