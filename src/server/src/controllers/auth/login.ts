import { login } from '@/database/auth/login';
import { isValidToken } from '@/database/auth/token';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { LoginRoute } from '@/openapi/auth/login';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie, setCookie } from 'hono/cookie';

const loginController: RouteController<LoginRoute> = async (c) => {
  const token = getCookie(c, 'user_token');
  if (token) {
    const isValid = await isValidToken(token);
    if (isValid) {
      return httpSuccessResponse(c, null);
    }
  }
  const { username, password } = await c.req.valid('json');
  const userToken = await login(username, password);
  const user = await getUserFromToken(userToken);
  setCookie(c, 'user_theme', user.theme);
  setCookie(c, 'user_token', userToken);
  return httpSuccessResponse(c, null);
};

export default loginController;
