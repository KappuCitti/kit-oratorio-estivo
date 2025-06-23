import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const usersStatsRouteDef = createRoute({
  tags: ['Stats'],
  method: 'get',
  path: '/stats/users/{year}',
  middleware: can('see_stats'),
  request: {
    params: z.object({
      year: z.coerce.number().int().positive().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        total: z.number().int().nonnegative(),
        schools: z.array(
          z.object({
            id: idSchema,
            name: z.string(),
            total: z.number().int().nonnegative(),
            classes: z.array(
              z.object({
                id: idSchema,
                name: z.string(),
                total: z.number().int().nonnegative(),
              })
            ),
          })
        ),
      }),
      'Users stats'
    ),
  },
});

export type UsersStatsRoute = typeof usersStatsRouteDef;
