import { HttpStatusCodes } from '@/codes';
import { getPeople } from '@/database/people/getPeople';
import type { RouteController } from '@/models/app.model';
import type { GetPeopleRoute } from '@/openapi/people/getPeople';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getPeopleController: RouteController<GetPeopleRoute> = async (c) => {
  const { page, size, query, gender } = await c.req.valid('query');
  const people = await getPeople(page, size, query, gender);
  if (!people.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, people.data);
};

export default getPeopleController;
