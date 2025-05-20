import { HttpStatusCodes } from '@/codes';
import { phoneSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const registerRouteDef = createRoute({
  tags: ['Auth'],
  method: 'post',
  path: '/user/register',
  request: {
    body: createRequiredJsonBody(
      z.object({
        cf: z.string().length(16),
        phoneNumber: phoneSchema,
        name: z
          .string()
          .min(2, 'Name must be at least 2 characters long')
          .max(255, 'Name must be at most 255 characters long'),
        surname: z
          .string()
          .min(2, 'Surname must be at least 2 characters long')
          .max(255, 'Surname must be at most 255 characters long'),
        password: z
          .string()
          .min(5, 'Password must be at least 5 characters long')
          .max(255, 'Password must be at most 255 characters long'),
        role: z.string(),
        email: z.string().email().optional(),
      }),
      'User info and password'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'User successfully registered'
    ),
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'Role invalid or not allowed'
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

export type RegisterRoute = typeof registerRouteDef;
