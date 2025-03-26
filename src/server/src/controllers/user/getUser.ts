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
  if (!userRes.success) {
    switch (userRes.error) {
      case HttpStatusCodes.UNAUTHORIZED:
        return httpErrorResponse(c, userRes.error, 'Invalid token');
      default:
        return httpErrorResponse(c, userRes.error);
    }
  }
  return httpSuccessResponse(c, userRes.data);
};

export default getUserController;
