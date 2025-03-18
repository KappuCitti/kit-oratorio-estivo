import { HttpStatusCodes } from '@/codes';
import { deleteShirt } from '@/database/shirt/deleteShirt';
import type { RouteController } from '@/models/app.model';
import type { DeleteShirtRoute } from '@/openapi/shirt/deleteShirt';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteShirtController: RouteController<DeleteShirtRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const res = await deleteShirt(id);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, res.error, 'Shirt not found');
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default deleteShirtController;
