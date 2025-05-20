import { HttpStatusCodes } from '@/codes';
import { createUsers } from '@/database/user/admin/createUsers';
import type { RouteController } from '@/models/app.model';
import type { CreateUsersRoute } from '@/openapi/user/createUsers';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createUsersController: RouteController<CreateUsersRoute> = async (c) => {
  const { users } = c.req.valid('json');
  const res = await createUsers(users);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(c, HttpStatusCodes.FORBIDDEN, 'Invalid roles');
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

export default createUsersController;
