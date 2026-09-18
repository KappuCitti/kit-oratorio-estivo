import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editWeekRouteDef = createRoute({
  tags: ['Week'],
  method: 'put',
  path: '/weeks/{id}',
  middleware: can('manage_weeks'),
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      z.object({
        maxEnrollments: z.number().int().positive().optional(),
        allowOverbooking: z.boolean().optional(),
      }),
      'Place limit and what happens when it is reached'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, z.null(), 'Week updated'),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Nothing to change'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Week not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type EditWeekRoute = typeof editWeekRouteDef;
