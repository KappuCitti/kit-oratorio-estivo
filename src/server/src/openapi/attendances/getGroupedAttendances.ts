import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { idSchema } from '@/models/common.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute, z } from '@hono/zod-openapi';

export const getGroupedAttendancesRouteDef = createRoute({
  tags: ['Attendance'],
  method: 'get',
  path: '/attendances/grouped',
  middleware: can('manage_attendances'),
  request: {
    query: z.object({
      date: z.string().date(),
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
      'Grouped attendances stats'
    ),
  },
});

export type GetGroupedAttendancesRoute = typeof getGroupedAttendancesRouteDef;
