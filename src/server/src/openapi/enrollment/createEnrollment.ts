import { HttpStatusCodes } from '@/codes';
import { CLASSES } from '@/models/class.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
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
  request: {
    body: createRequiredJsonBody(
      z.object({
        childId: z.number().int().positive(),
        teamId: z.number().int().positive().optional(),
        shirtSizeId: z.number().int().positive().optional(),
        weeks: z.array(weekEnrollmentSchema),
        dataProcessingConsent: z.boolean(),
        exitAuthorization: z.boolean(),
        schoolType: z.enum(SCHOOL_TYPES),
        className: z.enum(CLASSES),
        section: z.string().max(1, 'Section must be 1 character long'),
        year: z.number().int().positive(),
        parentNotes: z
          .string()
          .max(255, 'Max parent notes size reached')
          .optional(),
        managerNotes: z
          .string()
          .max(255, 'Max manager notes size reached')
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
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateEnrollmentRoute = typeof createEnrollmentRouteDef;
