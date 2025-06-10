import { createShirt } from '@/database/shirt/createShirt';
import type { RouteController } from '@/models/app.model';
import type { CreateShirtRoute } from '@/openapi/shirt/createShirt';
import { httpSuccessResponse } from '@/utils/responses';

const createShirtController: RouteController<CreateShirtRoute> = async (c) => {
  const { width, height, sizeName, isAvailable } = c.req.valid('json');
  const shirtId = await createShirt(sizeName, width, height, isAvailable);
  return httpSuccessResponse(c, shirtId);
};

export default createShirtController;
