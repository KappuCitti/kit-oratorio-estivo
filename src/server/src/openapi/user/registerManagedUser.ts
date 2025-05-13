import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const getUserInfoRouteDef = createRoute({
  tags: ['User'],
  method: 'post',
  path: '/user',
  middleware: can('register_child_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        name: z.string(),
        surname: z.string(),
        email: z.string().email().optional(),
        birthDate: z.coerce.date(),
        birthPlace: z.string(),
        sex: z.enum(['M', 'F']),
        address: z.object({
          street: z.string(),
          city: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
      }),
      'Info of the user to register'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'User successfully registered'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Username or email already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetUserInfoRoute = typeof getUserInfoRouteDef;
