import type { RouteController } from '@/models/app.model';
import type { LogoutRoute } from '@/openapi/auth/logout';
import { httpSuccessResponse } from '@/utils/responses';
import { deleteCookie } from 'hono/cookie';
const logoutController: RouteController<LogoutRoute> = async (c) => {
  deleteCookie(c, 'user_token');
  return httpSuccessResponse(c, null);
};

export default logoutController;
