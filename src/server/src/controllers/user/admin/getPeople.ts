import { getPeopleList } from '@/database/user/admin/getPeopleList';
import type { RouteController } from '@/models/app.model';
import type { GetPeopleRoute } from '@/openapi/user/admin/getPeople';
import { httpSuccessResponse } from '@/utils/responses';

const getPeopleController: RouteController<GetPeopleRoute> = async (c) => {
  const { page, size, query, gender, roleId } = await c.req.valid('query');
  const people = await getPeopleList(page, size, query, gender, roleId);
  return httpSuccessResponse(c, people);
};

export default getPeopleController;
