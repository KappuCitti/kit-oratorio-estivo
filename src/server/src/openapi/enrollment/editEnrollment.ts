import { HttpStatusCodes } from '@/codes';
import { idSchema, paramIdSchema } from '@/models/common.model';
import { weekEnrollmentSchema } from '@/models/week.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const editEnrollmentRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'put',
  path: '/enrollments/{id}',
  request: {
    params: paramIdSchema,
    body: createRequiredJsonBody(
      z.object({
        team: z.number().int().positive().nullable().optional(),
        shirt: z.number().int().positive().nullable().optional(),
        weeks: z.array(weekEnrollmentSchema),
        dataProcessingConsent: z.boolean(),
        exitAuthorization: z.boolean(),
        schoolId: idSchema,
        classId: idSchema,
        section: z.string().max(1, 'Section must be 1 character long'),
        year: z.number().int().positive(),
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
      'Fields of enrollment to modify'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Enrollment modified successfully'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'One or more ids are invalid'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type EditEnrollmentRoute = typeof editEnrollmentRouteDef;
