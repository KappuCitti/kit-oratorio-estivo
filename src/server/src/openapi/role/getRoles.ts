import { HttpStatusCodes } from '@/codes';
import { roleTable } from '@/database/schema/role';
import { can } from '@/middlewares/hasPermission';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const roleSchema = createSelectSchema(roleTable);

/**
 * L'elenco dei ruoli.
 *
 * Sta dietro `see_users` perche' e' materiale della rubrica: chi non puo'
 * vedere le persone non ha motivo di sapere quali ruoli esistono.
 */
export const getRoleListRouteDef = createRoute({
  tags: ['Role'],
  method: 'get',
  path: '/roles',
  middleware: can('see_users'),
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(roleSchema),
      'List of roles'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetRoleListRoute = typeof getRoleListRouteDef;
