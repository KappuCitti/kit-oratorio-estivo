import { createClass } from '@/database/class/createClass';
import type { RouteController } from '@/models/app.model';
import type { CreateClassRoute } from '@/openapi/class/createClass';
import { httpSuccessResponse } from '@/utils/responses';

const createClassController: RouteController<CreateClassRoute> = async (c) => {
  const { name, schoolId } = await c.req.valid('json');
  const res = await createClass(name, schoolId);
  return httpSuccessResponse(c, res);
};

export default createClassController;
