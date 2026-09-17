import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import {
  coercedIdSchema,
  queryPageSchema,
  querySizeSchema,
} from '@/models/common.model';
import { personListItemSchema } from '@/models/person.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

/**
 * La rubrica dell'amministratore.
 *
 * Non va confusa con GET /users, che restituisce le sole persone GESTITE da chi
 * e' collegato (i propri figli) e non accetta filtri.
 */
export const getPeopleRouteDef = createRoute({
  tags: ['User'],
  method: 'get',
  path: '/admin/people',
  middleware: can('see_users'),
  request: {
    query: z.object({
      page: queryPageSchema,
      size: querySizeSchema,
      query: z.string().max(100).optional(),
      gender: z.enum(['M', 'F']).optional(),
      roleId: coercedIdSchema.optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        elements: z.array(personListItemSchema),
        count: z.number().int(),
      }),
      'List of people'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetPeopleRoute = typeof getPeopleRouteDef;
