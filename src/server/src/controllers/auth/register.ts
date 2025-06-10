import { register } from '@/database/auth/register';
import type { RouteController } from '@/models/app.model';
import type { RegisterRoute } from '@/openapi/auth/register';
import { httpSuccessResponse } from '@/utils/responses';

const registerController: RouteController<RegisterRoute> = async (c) => {
  const { cf, name, surname, password, role, email, phoneNumber } =
    await c.req.valid('json');
  await register(cf, name, surname, password, role, phoneNumber, email);
  return httpSuccessResponse(c, null);
};

export default registerController;
