import { HttpStatusCodes } from '@/codes';
import { editShirt } from '@/database/shirt/editShirt';
import type { RouteController } from '@/models/app.model';
import type { EditShirtRoute } from '@/openapi/shirt/editShirt';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editShirtController: RouteController<EditShirtRoute> = async (c) => {
  const { width, height, sizeName, isAvailable } = c.req.valid('json');
  const { id } = c.req.valid('param');
  const result = await editShirt(id, sizeName, width, height, isAvailable);
  if (!result.success) {
    switch (result.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, result.error, 'Shirt not found');
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(c, result.error, 'Shirt size already exists');
      default:
        return httpErrorResponse(c, result.error);
    }
  }
  return httpSuccessResponse(c, result.data);
};

export default editShirtController;
