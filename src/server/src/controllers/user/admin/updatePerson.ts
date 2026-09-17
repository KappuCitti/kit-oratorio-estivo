import { updatePerson } from '@/database/user/admin/updatePerson';
import type { RouteController } from '@/models/app.model';
import type { UpdatePersonRoute } from '@/openapi/user/admin/updatePerson';
import { httpSuccessResponse } from '@/utils/responses';

const updatePersonController: RouteController<UpdatePersonRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const data = await c.req.valid('json');
  await updatePerson(id, data);
  return httpSuccessResponse(c, null);
};

export default updatePersonController;
