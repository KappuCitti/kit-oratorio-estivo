import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { createFamilySchema } from '@/models/person.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

/**
 * Crea un nucleo familiare: le persone e i legami che le collegano, in una
 * sola transazione.
 *
 * POST /admin/users crea UNA persona e nessuna relazione: inserire una famiglia
 * significava una chiamata per persona piu' una per ogni legame, senza
 * transazione, con il rischio di lasciare il lavoro a meta'.
 */
export const createFamilyRouteDef = createRoute({
  tags: ['User'],
  method: 'post',
  path: '/admin/family',
  middleware: can('manage_users'),
  request: {
    body: createRequiredJsonBody(
      createFamilySchema,
      'People of the family and how they relate'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(z.string()),
      'Family created, returns the ids of the created people'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Invalid role or no one to manage'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'A person with the same tax code or email already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateFamilyRoute = typeof createFamilyRouteDef;
