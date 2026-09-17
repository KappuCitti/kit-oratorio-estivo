import { deletePerson } from '@/database/user/admin/deletePerson';
import type { RouteController } from '@/models/app.model';
import type { DeletePersonRoute } from '@/openapi/user/admin/deletePerson';
import { httpSuccessResponse } from '@/utils/responses';

const deletePersonController: RouteController<DeletePersonRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  await deletePerson(id);
  return httpSuccessResponse(c, null);
};

export default deletePersonController;
