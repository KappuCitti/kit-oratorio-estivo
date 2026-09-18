import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

const namedSchema = z.object({ id: z.number().int(), name: z.string() });

export const managedEnrollmentSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string(),
    gender: z.enum(['M', 'F']).nullable(),
  }),
  status: z.enum(['enrolled', 'pending', 'none']),
  class: namedSchema.nullable(),
  school: namedSchema.nullable(),
  section: z.string().nullable(),
  weeks: z.array(
    z.object({ weekId: z.number().int(), isPaid: z.boolean().nullable() })
  ),
});

/**
 * Le iscrizioni delle persone gestite da chi e' collegato: la vista del
 * genitore. Sta sotto /users perche' riguarda le proprie persone, come
 * GET /users; /enrollments/{...} e' invece l'area dei responsabili.
 */
export const getManagedEnrollmentsRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'get',
  path: '/users/enrollments',
  middleware: can('manage_self_child_users'),
  request: {
    query: z.object({
      year: z.coerce.number().int().positive(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(managedEnrollmentSchema),
      'Enrollment status of every managed person'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetManagedEnrollmentsRoute = typeof getManagedEnrollmentsRouteDef;
