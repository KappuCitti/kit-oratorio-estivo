import { getUserFromToken } from '@/database/user/getFromToken';
import { getManagedUsers } from '@/database/user/managed/getManagedUsers';
import type { RouteController } from '@/models/app.model';
import type { GetManagedUserListRoute } from '@/openapi/user/getManagedUsers';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getManagedUsersController: RouteController<
  GetManagedUserListRoute
> = async (c) => {
  const token = getCookie(c, 'user_token') as string;
  const user = await getUserFromToken(token);
  const res = await getManagedUsers(user.id);

  return httpSuccessResponse(c, res);
};

export default getManagedUsersController;
