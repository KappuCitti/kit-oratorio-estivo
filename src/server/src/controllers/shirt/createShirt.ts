import { HttpStatusCodes } from '@/codes';
import { createShirt } from '@/database/shirt/createShirt';
import type { RouteController } from '@/models/app.model';
import type { CreateShirtRoute } from '@/openapi/shirt/createShirt';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createShirtController: RouteController<CreateShirtRoute> = async (c) => {
  const { width, height, sizeName, isAvailable } = c.req.valid('json');
  const shirtId = await createShirt(sizeName, width, height, isAvailable);
  if (!shirtId.success) {
    switch (shirtId.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(c, shirtId.error, 'Shirt size already exists');
      default:
        return httpErrorResponse(c, shirtId.error);
    }
  }
  return httpSuccessResponse(c, shirtId.data);
};

export default createShirtController;
