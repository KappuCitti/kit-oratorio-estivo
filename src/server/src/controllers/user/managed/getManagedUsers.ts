import { HttpStatusCodes } from '@/codes';
import { getUserFromToken } from '@/database/user/getFromToken';
import { getManagedUsers } from '@/database/user/managed/getManagedUsers';
import type { RouteController } from '@/models/app.model';
import type { GetManagedUserListRoute } from '@/openapi/user/getManagedUsers';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getManagedUsersController: RouteController<
  GetManagedUserListRoute
> = async (c) => {
  const token = getCookie(c, 'user_token') as string;
  const user = await getUserFromToken(token);
  if (!user.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  const res = await getManagedUsers(user.data.id);

  if (!res.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);

  return httpSuccessResponse(c, res.data);
};

export default getManagedUsersController;
