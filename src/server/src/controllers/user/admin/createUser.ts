import { createUser } from '@/database/user/admin/createUser';
import type { RouteController } from '@/models/app.model';
import type { CreateUserRoute } from '@/openapi/user/createUser';
import { httpSuccessResponse } from '@/utils/responses';

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
  return httpSuccessResponse(c, null);
};

export default createUserController;
