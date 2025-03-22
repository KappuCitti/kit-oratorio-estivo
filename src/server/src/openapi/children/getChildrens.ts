import { HttpStatusCodes } from '@/codes';
import { childSchema } from '@/models/children.model';
import { queryPageSchema, querySizeSchema } from '@/models/common.model';
import { GENDERS } from '@/models/gender.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getChildListRouteDef = createRoute({
  tags: ['Family', 'Children'],
  method: 'get',
  path: '/childs',
  request: {
    query: z.object({
      page: queryPageSchema,
      size: querySizeSchema,
      query: z.string().max(100, 'Max query size reached').optional(),
      gender: z.enum(GENDERS).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        count: z.number().int().nonnegative(),
        childs: z.array(childSchema),
      }),
      'List of childrens'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetChildListRoute = typeof getChildListRouteDef;
