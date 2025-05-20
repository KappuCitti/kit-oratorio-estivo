import { HttpStatusCodes } from '@/codes';
import { createClass } from '@/database/class/createClass';
import type { RouteController } from '@/models/app.model';
import type { CreateClassRoute } from '@/openapi/class/createClass';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createClassController: RouteController<CreateClassRoute> = async (c) => {
  const { name, schoolId } = await c.req.valid('json');
  const res = await createClass(name, schoolId);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'School does not exist'
        );
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'Class already exists'
        );
      case HttpStatusCodes.INTERNAL_SERVER_ERROR:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default createClassController;
