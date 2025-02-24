import { HttpStatusCodes } from '@/codes';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const registerRouteDef = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/register',
  request: {
    body: createRequiredJsonBody(
      z.object({
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
        roleIds: z.array(z.number()).min(1, 'At least one role is required'),
        email: z.string().optional(),
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
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'Missing or invalid registration data'
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
