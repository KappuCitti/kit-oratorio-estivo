import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { activityWeekSchema } from '@/models/activity.model';
import { idSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const addActivityRouteDef = createRoute({
  tags: ['Activity'],
  method: 'post',
  path: '/activities',
  middleware: can('manage_activities'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        name: z.string().min(2).max(255),
        place: z.string().min(2).max(255).nullable().optional(),
        weeks: z.array(activityWeekSchema),
      }),
      'Data of the activity to add'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
      'Activity successfully added'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Invalid data provided'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Activity name is already taken'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type AddActivityRoute = typeof addActivityRouteDef;
