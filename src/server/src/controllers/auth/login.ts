import { HttpStatusCodes } from '@/codes';
import { login } from '@/database/auth/login';
import { isValidToken } from '@/database/auth/token';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { LoginRoute } from '@/openapi/auth/login';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie, setCookie } from 'hono/cookie';

const loginController: RouteController<LoginRoute> = async (c) => {
  const token = getCookie(c, 'user_token');
  if (token) {
    const isValid = await isValidToken(token);
    if (!isValid.success) {
      return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (isValid.data) {
      return httpSuccessResponse(c, null);
    }
  }
  const { username, password } = await c.req.valid('json');
  const res = await login(username, password);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.UNAUTHORIZED:
        return httpErrorResponse(
          c,
          HttpStatusCodes.UNAUTHORIZED,
          'Invalid username or password'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  const userRes = await getUserFromToken(res.data);
  if (!userRes.success) {
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
  const user = userRes.data;
  setCookie(c, 'user_theme', user.theme);
  setCookie(c, 'user_token', res.data);
  return httpSuccessResponse(c, null);
};

export default loginController;
