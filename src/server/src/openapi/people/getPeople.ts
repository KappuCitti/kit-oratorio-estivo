import { HttpStatusCodes } from '@/codes';
import { GENDERS } from '@/models/gender.model';
import { peopleSchema } from '@/models/people.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getPeopleRouteDef = createRoute({
  tags: ['People'],
  method: 'get',
  path: '/people',
  request: {
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      size: z.coerce.number().positive().max(200).default(25),
      query: z.string().max(100, 'Max query size reached').optional(),
      gender: z.enum(GENDERS).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      z.object({
        count: z.number().int().positive(),
        people: z.array(peopleSchema),
      }),
      'List of childs and parents'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetPeopleRoute = typeof getPeopleRouteDef;
