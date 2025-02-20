import { login } from '@/database/auth/login';
import { isValidToken } from '@/database/auth/token';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { LoginRoute } from '@/openapi/auth/login';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { getCookie, setCookie } from 'hono/cookie';

const loginController: RouteController<LoginRoute> = async (c) => {
  const token = getCookie(c, 'user_token');
  if (token) {
    const isValid = await isValidToken(token);
    if (!isValid.success) {
      return c.json(createErrorResult('Internal server error'), 500);
    }
    if (isValid.data) {
      return c.json(createSuccessResult(null), 200);
    }
  }
  const { username, password } = await c.req.valid('json');
  const res = await login(username, password);
  if (!res.success) {
    return c.json(createErrorResult('Internal server error'), 500);
  }
  if (!res.data) {
    return c.json(createErrorResult('Invalid username or password'), 401);
  }
  const userRes = await getUserFromToken(res.data);
  if (!userRes.success) {
    return c.json(createErrorResult('Internal server error'), 500);
  }
  const user = userRes.data;
  if (!user) return c.json(createErrorResult('Internal server error'), 500);
  setCookie(c, 'user_theme', user.theme);
  setCookie(c, 'user_token', res.data);
  return c.json(createSuccessResult(null), 200);
};

export default loginController;
