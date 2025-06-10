import { createUsers } from '@/database/user/admin/createUsers';
import type { RouteController } from '@/models/app.model';
import type { CreateUsersRoute } from '@/openapi/user/createUsers';
import { httpSuccessResponse } from '@/utils/responses';

const createUsersController: RouteController<CreateUsersRoute> = async (c) => {
  const { users } = c.req.valid('json');
  await createUsers(users);
  return httpSuccessResponse(c, null);
};

export default createUsersController;
