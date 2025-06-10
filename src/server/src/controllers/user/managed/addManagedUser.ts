import { addManagedUser } from '@/database/user/managed/addManagedUser';
import type { RouteController } from '@/models/app.model';
import type { RegisterManagedUserRoute } from '@/openapi/user/registerManagedUser';
import { httpSuccessResponse } from '@/utils/responses';
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
  await addManagedUser(
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
  return httpSuccessResponse(c, null);
};

export default addManagedUserController;
