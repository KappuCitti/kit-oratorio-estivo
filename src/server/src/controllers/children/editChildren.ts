import { HttpStatusCodes } from '@/codes';
import { editChildren } from '@/database/children/editChildren';
import type { RouteController } from '@/models/app.model';
import type { EditChildRoute } from '@/openapi/children/editChildren';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editChildrenController: RouteController<EditChildRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const { name, surname, gender, birthPlace, birthDate, address } =
    await c.req.valid('json');
  const res = await editChildren(
    id,
    name,
    surname,
    gender,
    birthPlace,
    birthDate,
    address
  );
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Child not found'
        );
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'Child address is invalid'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default editChildrenController;
