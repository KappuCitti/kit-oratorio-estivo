import { HttpStatusCodes } from '@/codes';
import { register } from '@/database/auth/register';
import type { RouteController } from '@/models/app.model';
import type { RegisterRoute } from '@/openapi/auth/register';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const registerController: RouteController<RegisterRoute> = async (c) => {
  const { cf, name, surname, password, role, email, phoneNumber } =
    await c.req.valid('json');
  const registerRes = await register(
    cf,
    name,
    surname,
    password,
    role,
    phoneNumber,
    email
  );
  if (!registerRes.success) {
    switch (registerRes.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'User already exists'
        );
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(
          c,
          HttpStatusCodes.FORBIDDEN,
          'Role invalid or not allowed'
        );
      default:
        return httpErrorResponse(c, registerRes.error);
    }
  }
  return httpSuccessResponse(c, null);
};

export default registerController;
