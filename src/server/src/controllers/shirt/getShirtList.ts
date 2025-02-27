import { HttpStatusCodes } from '@/codes';
import { getShirtList } from '@/database/shirt/getShirtList';
import type { RouteController } from '@/models/app.model';
import type { GetShirtListRoute } from '@/openapi/shirt/getShirts';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getShirtsController: RouteController<GetShirtListRoute> = async (c) => {
  const shirts = await getShirtList();
  if (!shirts.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, shirts.data);
};

export default getShirtsController;
