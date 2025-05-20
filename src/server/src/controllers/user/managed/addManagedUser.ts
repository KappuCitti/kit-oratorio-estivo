import { HttpStatusCodes } from '@/codes';
import { addManagedUser } from '@/database/user/managed/addManagedUser';
import type { RouteController } from '@/models/app.model';
import type { RegisterManagedUserRoute } from '@/openapi/user/registerManagedUser';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const addManagedUserController: RouteController<
  RegisterManagedUserRoute
> = async (c) => {
  const {
    cf,
    password,
    name,
    surname,
    birthDate,
    birthPlace,
    gender,
    address,
    role,
    email,
  } = await c.req.valid('json');
  const token = getCookie(c, 'user_token') as string;
  const res = await addManagedUser(
    token,
    cf,
    password,
    name,
    surname,
    birthDate,
    birthPlace,
    gender,
    address.street,
    address.city,
    address.postalCode,
    address.country,
    role,
    email
  );
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'The provided data is invalid'
        );
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(
          c,
          HttpStatusCodes.FORBIDDEN,
          'Role cannot register'
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

export default addManagedUserController;
