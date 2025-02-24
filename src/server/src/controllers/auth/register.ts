import { HttpStatusCodes } from '@/codes';
import { register } from '@/database/auth/register';
import { isValidRole } from '@/database/role/isValid';
import type { RouteController } from '@/models/app.model';
import type { RegisterRoute } from '@/openapi/auth/register';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const registerController: RouteController<RegisterRoute> = async (c) => {
  const { name, surname, password, roleIds, email } = await c.req.valid('json');
  for (const roleId of roleIds) {
    const isValidRoleId = await isValidRole(roleId);
    if (!isValidRoleId.success) {
      return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!isValidRoleId.data) {
      return httpErrorResponse(
        c,
        HttpStatusCodes.BAD_REQUEST,
        'Role ' + roleId + ' does not exist'
      );
    }
  }
  const registerRes = await register(name, surname, password, roleIds, email);
  if (!registerRes.success) {
    if (registerRes.error === HttpStatusCodes.CONFLICT) {
      return httpErrorResponse(
        c,
        HttpStatusCodes.CONFLICT,
        'User already exists'
      );
    }
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
  return httpSuccessResponse(c, null);
};

export default registerController;
