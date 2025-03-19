import { HttpStatusCodes } from '@/codes';
import { editParent } from '@/database/parent/editParent';
import type { RouteController } from '@/models/app.model';
import type { EditParentRoute } from '@/openapi/parent/editParent';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editParentController: RouteController<EditParentRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const { name, surname, gender, email, phoneNumber } = await c.req.valid(
    'json'
  );
  const result = await editParent(
    id,
    name,
    surname,
    gender,
    email,
    phoneNumber
  );
  if (!result.success) {
    switch (result.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Parent not found'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, null);
};

export default editParentController;
