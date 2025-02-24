import { HttpStatusCodes } from '@/codes';
import { getUserList } from '@/database/user/getUserList';
import type { RouteController } from '@/models/app.model';
import type { GetUserListRoute } from '@/openapi/user/getUsers';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getUsersController: RouteController<GetUserListRoute> = async (c) => {
  const { page, size } = await c.req.valid('query');
  const users = await getUserList(page, size);
  if (!users.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, users.data);
};

export default getUsersController;
