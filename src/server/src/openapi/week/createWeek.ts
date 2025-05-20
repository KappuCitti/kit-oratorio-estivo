import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createWeekRouteDef = createRoute({
  tags: ['Week'],
  method: 'post',
  path: '/weeks',
  middleware: can('manage_weeks'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        startDate: z.string().date(),
        endDate: z.string().date(),
        price: z.number().positive(),
        maxEnrollments: z.number().int().positive(),
        registrationOpenDate: z.string().date(),
        registrationCloseDate: z.string().date(),
      }),
      'Data of the week'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.number(),
      'Week created successfully'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Week in that period already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateWeekRoute = typeof createWeekRouteDef;
