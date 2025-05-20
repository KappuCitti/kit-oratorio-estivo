import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const registerManagedUserRouteDef = createRoute({
  tags: ['User'],
  method: 'post',
  path: '/users',
  middleware: can('register_child_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        cf: z.string().length(16),
        password: z.string().min(8),
        name: z.string().min(2).max(255),
        surname: z.string().min(2).max(255),
        email: z.string().email().optional(),
        birthDate: z.string().date(),
        birthPlace: z.string().min(2).max(255),
        sex: z.enum(['M', 'F']),
        address: z.object({
          street: z.string().min(2).max(255),
          city: z.string().min(2).max(255),
          postalCode: z.string().min(2).max(255),
          country: z.string().min(2).max(255),
        }),
        role: z.string().min(2).max(255),
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
      'Invalid data provided'
    ),
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'Role cannot register'
    ),
    [HttpStatusCodes.CONFLICT]: createJsonResBody(
      false,
      z.string(),
      'User already exists'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type RegisterManagedUserRoute = typeof registerManagedUserRouteDef;
