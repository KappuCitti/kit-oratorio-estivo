import { editShirt } from '@/database/shirt/editShirt';
import type { RouteController } from '@/models/app.model';
import type { EditShirtRoute } from '@/openapi/shirt/editShirt';
import { httpSuccessResponse } from '@/utils/responses';

const editShirtController: RouteController<EditShirtRoute> = async (c) => {
  const { width, height, sizeName, isAvailable } = c.req.valid('json');
  const { id } = c.req.valid('param');
  await editShirt(id, sizeName, width, height, isAvailable);
  return httpSuccessResponse(c, null);
};

export default editShirtController;
