import { createRouter } from '@/utils/createApp';
import { createRoute, z } from '@hono/zod-openapi';

import { createJsonResBody } from '@/utils/createOpenApiBody';
import { getCookie, setCookie } from 'hono/cookie';
import { isValidToken } from '@/database/auth/token';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { login } from '@/database/auth/login';
import { getUserTheme } from '@/database/user/theme';
import { getUserFromToken } from '@/database/user/getFromToken';

const router = createRouter().openapi(
  createRoute({
    method: 'post',
    path: '/',
    responses: {
      200: createJsonResBody(true, z.null(), 'Login successful'),
      400: createJsonResBody(false, z.string(), 'Missing username or password'),
      401: createJsonResBody(false, z.string(), 'Invalid username or password'),
      500: createJsonResBody(
        false,
        z.string(),
        'Error while talking to database'
      ),
    },
  }),
  async (c) => {
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
    const { username, password } = await c.req.json();
    if (!username || !password) {
      return c.json(createErrorResult('Missing username or password'), 400);
    }
    const res = await login(username, password);
    if (!res.success) {
      return c.json(createErrorResult('Internal server error'), 500);
    }
    if (!res.data) {
      return c.json(createErrorResult('Invalid username or password'), 401);
    }
    const user = await getUserFromToken(res.data);
    if (!user.success) {
      return c.json(createErrorResult('Internal server error'), 500);
    }
    const theme = await getUserTheme(user.data.id);
    if (!theme.success) {
      return c.json(createErrorResult('Internal server error'), 500);
    }
    setCookie(c, 'user_token', res.data);
    return c.json(createSuccessResult(null), 200);
  }
);

export default router;
