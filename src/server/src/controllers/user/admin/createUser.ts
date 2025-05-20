import { HttpStatusCodes } from '@/codes';
import { createUser } from '@/database/user/admin/createUser';
import type { RouteController } from '@/models/app.model';
import type { CreateUserRoute } from '@/openapi/user/createUser';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createUserController: RouteController<CreateUserRoute> = async (c) => {
  const {
    cf,
    password,
    name,
    surname,
    email,
    phoneNumber,
    address,
    gender,
    roleId,
    birthDate,
    birthPlace,
  } = c.req.valid('json');
  const res = await createUser(
    cf,
    password,
    name,
    surname,
    roleId,
    gender,
    birthDate,
    birthPlace,
    address,
    email,
    phoneNumber
  );
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'Invalid role'
        );
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'Email or CF already exists'
        );
    }
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
  return httpSuccessResponse(c, null);
};

export default createUserController;
