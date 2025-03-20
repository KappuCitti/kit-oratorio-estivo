import { HttpStatusCodes } from '@/codes';
import { queryPageSchema, querySizeSchema } from '@/models/common.model';
import { bareUserSchema } from '@/models/user.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getUserListRouteDef = createRoute({
  tags: ['User'],
  method: 'get',
  path: '/users',
  request: {
    query: z.object({
      page: queryPageSchema,
      size: querySizeSchema,
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(bareUserSchema),
      'List of users'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetUserListRoute = typeof getUserListRouteDef;
