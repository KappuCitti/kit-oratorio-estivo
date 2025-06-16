import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { weekEnrollmentSchema } from '@/models/week.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const approveEnrollmentRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'post',
  path: '/enrollments',
  middleware: can('manage_enrollments'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        queueId: idSchema,
        teamId: z.union([idSchema, z.null()]).optional(),
        weeks: z.array(weekEnrollmentSchema),
        managerNotes: z.union([
          z.string().max(255, 'Max manager notes size reached'),
          z.null(),
        ]),
        exitAuthorization: z.union([z.boolean(), z.null()]).optional(),
      }),
      'Enrollment to add'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.number().int().positive(),
      'Enrollment created successfully, returns enrollment id'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Enrollment queue not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type ApproveEnrollmentRoute = typeof approveEnrollmentRouteDef;
