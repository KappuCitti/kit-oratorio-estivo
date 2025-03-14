import { HttpStatusCodes } from '@/codes';
import { getChildrens } from '@/database/children/getChildrens';
import type { RouteController } from '@/models/app.model';
import type { GetChildListRoute } from '@/openapi/children/getChildrens';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getChildrensController: RouteController<GetChildListRoute> = async (
  c
) => {
  const { page, size, query, gender } = await c.req.valid('query');
  const childrens = await getChildrens(page, size, query, gender);
  if (!childrens.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, childrens.data);
};

export default getChildrensController;
