import { createFamily } from '@/database/user/admin/createFamily';
import type { RouteController } from '@/models/app.model';
import type { CreateFamilyRoute } from '@/openapi/user/admin/createFamily';
import { httpSuccessResponse } from '@/utils/responses';

const createFamilyController: RouteController<CreateFamilyRoute> = async (c) => {
  const data = await c.req.valid('json');
  const ids = await createFamily(data);
  return httpSuccessResponse(c, ids);
};

export default createFamilyController;
