import { HttpStatusCodes } from '@/codes';
import { isLogged } from '@/middlewares/isLogged';
import { MIN_PASSWORD_LENGTH } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const changePasswordRouteDef = createRoute({
  tags: ['User', 'Auth'],
  method: 'put',
  path: '/user/password',
  middleware: isLogged,
  request: {
    body: createRequiredJsonBody(
      z.object({
        oldPassword: z
          .string()
          .min(1, 'Old password is required')
          .max(255, 'Old password must be at most 255 characters long'),
        newPassword: z
          .string()
          .min(
            MIN_PASSWORD_LENGTH,
            `New password must be at least ${MIN_PASSWORD_LENGTH} characters long`
          )
          .max(255, 'New password must be at most 255 characters long'),
      }),
      'Old and new password'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Password successfully changed'
    ),
    [HttpStatusCodes.BAD_REQUEST]: createJsonResBody(
      false,
      z.string(),
      'New password is the same as the old one'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: createJsonResBody(
      false,
      z.string(),
      'Token is invalid, has expired or password is incorrect'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type ChangePasswordRoute = typeof changePasswordRouteDef;
