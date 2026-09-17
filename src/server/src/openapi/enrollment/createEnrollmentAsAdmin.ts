import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema, idSchema } from '@/models/common.model';
import { weekEnrollmentSchema } from '@/models/week.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const createEnrollmentAsAdminRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'post',
  path: '/admin/enrollments',
  middleware: can('manage_enrollments'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        userId: cfSchema,
        classId: idSchema,
        section: z.string().length(1),
        weeks: z.array(weekEnrollmentSchema).min(1),
        team: idSchema.nullable().optional(),
        shirt: idSchema.nullable().optional(),
        dataProcessingConsent: z.boolean(),
        imageProcessingConsent: z.boolean().default(false),
        exitAuthorization: z.boolean().nullable().optional(),
        parentNotes: z.string().max(255).nullable().optional(),
        managerNotes: z.string().max(255).nullable().optional(),
        specialDiet: z.string().max(255).nullable().optional(),
        /**
         * Salta la finestra di iscrizione e il limite di posti: e' la cosiddetta
         * iscrizione "super", per chi si presenta allo sportello a iscrizioni
         * chiuse o a settimana piena. I controlli di integrita' restano.
         */
        ignoreRestrictions: z.boolean().default(false),
      }),
      'Enrollment to create directly, without going through the queue'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      idSchema,
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
      'The user cannot be enrolled'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'Already enrolled, registrations closed, or week full'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateEnrollmentAsAdminRoute =
  typeof createEnrollmentAsAdminRouteDef;
