import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { activityTableSchema } from '@/models/activity.model';
import { idSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const subscribeToActivityRouteDef = createRoute({
  tags: ['Activity'],
  method: 'post',
  path: '/activities/{id}/subscribe',
  middleware: can('manage_self_child_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        weekId: idSchema,
        userId: z.string().length(16),
      }),
      'Data to subscribe to activity'
    ),
    params: z.object({
      activityId: idSchema,
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Subscribed to activity'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'User cannot join activity'
    ),
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'Invalid user or missing permissions'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type SubscribeToActivityRoute = typeof subscribeToActivityRouteDef;
