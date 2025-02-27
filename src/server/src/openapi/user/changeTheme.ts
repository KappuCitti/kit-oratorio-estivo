import { HttpStatusCodes } from '@/codes';
import { THEMES } from '@/models/theme.model';
import { fullUserSchema } from '@/models/user.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const changeUserThemeRouteDef = createRoute({
  tags: ['user'],
  method: 'post',
  path: '/user/theme',
  request: {
    body: createRequiredJsonBody(
      z.object({ theme: z.enum(THEMES) }),
      'Theme to set'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.null(),
      'Theme successfully changed'
    ),
    [HttpStatusCodes.UNAUTHORIZED]: createJsonResBody(
      false,
      z.string(),
      'Token is invalid or has expired'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type ChangeUserThemeRoute = typeof changeUserThemeRouteDef;
