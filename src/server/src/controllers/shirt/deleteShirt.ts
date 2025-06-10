import { deleteShirt } from '@/database/shirt/deleteShirt';
import type { RouteController } from '@/models/app.model';
import type { DeleteShirtRoute } from '@/openapi/shirt/deleteShirt';
import { httpSuccessResponse } from '@/utils/responses';

const deleteShirtController: RouteController<DeleteShirtRoute> = async (c) => {
  const { id } = c.req.valid('param');
  await deleteShirt(id);
  return httpSuccessResponse(c, null);
};

export default deleteShirtController;
