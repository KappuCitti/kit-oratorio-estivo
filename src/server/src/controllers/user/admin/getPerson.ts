import { getPerson } from '@/database/user/admin/getPerson';
import type { RouteController } from '@/models/app.model';
import type { GetPersonRoute } from '@/openapi/user/admin/getPerson';
import { httpSuccessResponse } from '@/utils/responses';

const getPersonController: RouteController<GetPersonRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const person = await getPerson(id);
  return httpSuccessResponse(c, person);
};

export default getPersonController;
