import { getFullUserFromToken } from '@/database/user/getUser';
import type { RouteController } from '@/models/app.model';
import type { GetSelfInfoRoute } from '@/openapi/user/getSelfInfo';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getSelfInfoController: RouteController<GetSelfInfoRoute> = async (c) => {
  const token = getCookie(c, 'user_token') as string;
  const user = await getFullUserFromToken(token);
  return httpSuccessResponse(c, user!);
};

export default getSelfInfoController;
