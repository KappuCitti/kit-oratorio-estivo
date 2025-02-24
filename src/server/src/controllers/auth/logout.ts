import { HttpStatusCodes } from '@/codes';
import { logout } from '@/database/auth/logout';
import type { RouteController } from '@/models/app.model';
import type { LogoutRoute } from '@/openapi/auth/logout';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { deleteCookie } from 'hono/cookie';
const logoutController: RouteController<LogoutRoute> = async (c) => {
  const cookie = deleteCookie(c, 'user_token');
  if (!cookie) return httpSuccessResponse(c, null);
  const res = await logout(cookie);
  if (!res.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, null);
};

export default logoutController;
