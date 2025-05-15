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

export const createEnrollmentRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'post',
  path: '/enrollments',
  middleware: can('manage_self_child_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        user: z.string(),
        shirt: z.union([z.number().int().positive(), z.null()]).optional(),
        weeks: z.array(weekEnrollmentSchema),
        dataProcessingConsent: z.boolean(),
        imageProcessingConsent: z.boolean(),
        exitAuthorization: z.boolean(),
        schoolId: idSchema,
        classId: idSchema,
        specialDiet: z.union([z.string().max(255), z.null()]).optional(),
        parentNotes: z
          .union([
            z.string().max(255, 'Max parent notes size reached'),
            z.null(),
          ])
          .optional(),
        managerNotes: z
          .union([
            z.string().max(255, 'Max manager notes size reached'),
            z.null(),
          ])
          .optional(),
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
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'Invalid user'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Child is already enrolled for the year or year is invalid'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateEnrollmentRoute = typeof createEnrollmentRouteDef;
