import { createFamily } from '@/database/family/createFamily';
import type { RouteController } from '@/models/app.model';
import type { CreateFamilyRoute } from '@/openapi/family/createFamily';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createFamilyController: RouteController<CreateFamilyRoute> = async (
  c
) => {
  const family = await c.req.valid('json');
  const results = await createFamily(family);
  if (!results.success) return httpErrorResponse(c, results.error);
  return httpSuccessResponse(c, results.data);
};

export default createFamilyController;
