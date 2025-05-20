import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { adminCreateUserSchema } from '@/models/user.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const createUsersRouteDef = createRoute({
  tags: ['User'],
  method: 'post',
  path: '/admin/users',
  middleware: can('manage_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        users: z.array(adminCreateUserSchema),
      }),
      'Info of the users to register'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Users successfully registered'
    ),
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'Invalid roles'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'User(s) already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type CreateUsersRoute = typeof createUsersRouteDef;
