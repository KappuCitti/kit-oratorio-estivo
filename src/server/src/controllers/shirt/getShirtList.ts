import { getShirtList } from '@/database/shirt/getShirtList';
import type { RouteController } from '@/models/app.model';
import type { GetShirtListRoute } from '@/openapi/shirt/getShirts';
import { httpSuccessResponse } from '@/utils/responses';

const getShirtsController: RouteController<GetShirtListRoute> = async (c) => {
  const shirts = await getShirtList();
  return httpSuccessResponse(c, shirts);
};

export default getShirtsController;
