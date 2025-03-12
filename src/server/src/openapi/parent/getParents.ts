import { HttpStatusCodes } from '@/codes';
import { GENDERS } from '@/models/gender.model';
import { parentSchema } from '@/models/parent.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getParentListRouteDef = createRoute({
  tags: ['Family', 'Parent'],
  method: 'get',
  path: '/parents',
  request: {
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      size: z.coerce.number().positive().max(200).default(25),
      query: z.string().max(100, 'Max query size reached').optional(),
      gender: z.enum(GENDERS).optional(),
      child: z.coerce.number().positive().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.array(parentSchema),
      'List of parents'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetParentListRoute = typeof getParentListRouteDef;
