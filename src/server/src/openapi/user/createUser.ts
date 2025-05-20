import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { idSchema, phoneSchema } from '@/models/common.model';
import { adminCreateUserSchema } from '@/models/user.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const createUserRouteDef = createRoute({
  tags: ['User'],
  method: 'post',
  path: '/admin/users',
  middleware: can('manage_users'),
  request: {
    body: createRequiredJsonBody(
      z.object({
        cf: z.string().length(16),
        password: z.string().min(8).max(255),
        email: z.string().email().optional(),
        phoneNumber: phoneSchema.optional(),
        roleId: idSchema,
        name: z.string().min(1).max(255),
        surname: z.string().min(1).max(255),
        birthDate: z.string().date().optional(),
        birthPlace: z.string().min(1).max(255).optional(),
        gender: z.enum(['M', 'F']),
        address: z
          .object({
            street: z.string().min(1).max(255),
            city: z.string().min(1).max(255),
            country: z.string().min(1).max(255),
            postalCode: z.string().min(1).max(255),
          })
          .optional(),
      }),
      'Info of the user to create'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Users successfully registered'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Invalid role'
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

export type CreateUserRoute = typeof createUserRouteDef;
