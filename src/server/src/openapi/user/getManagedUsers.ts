import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { bareUserSchema } from '@/models/user.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getManagedUserListRouteDef = createRoute({
  tags: ['User'],
  method: 'get',
  path: '/users',
  middleware: can('manage_self_child_users'),
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(bareUserSchema),
      'List of managed users'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetManagedUserListRoute = typeof getManagedUserListRouteDef;
