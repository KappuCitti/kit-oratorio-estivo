import { HttpStatusCodes } from '@/codes';
import { getUserWithPermissionsFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { GetUserInfoRoute } from '@/openapi/user/userInfo';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getUserController: RouteController<GetUserInfoRoute> = async (c) => {
  const token = getCookie(c, 'user_token');
  if (!token) return httpErrorResponse(c, HttpStatusCodes.UNAUTHORIZED);
  const userRes = await getUserWithPermissionsFromToken(token);
  if (!userRes.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  if (!userRes.data)
    return httpErrorResponse(c, HttpStatusCodes.UNAUTHORIZED, 'Invalid token');
  return httpSuccessResponse(c, userRes.data);
};

export default getUserController;
