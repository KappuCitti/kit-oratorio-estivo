import { HttpStatusCodes } from '@/codes';
import { changeUserTheme } from '@/database/user/changeUserTheme';
import type { RouteController } from '@/models/app.model';
import type { ChangeUserThemeRoute } from '@/openapi/user/changeTheme';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie, setCookie } from 'hono/cookie';

const changeThemeController: RouteController<ChangeUserThemeRoute> = async (
  c
) => {
  const token = getCookie(c, 'user_token');
  if (!token) return httpErrorResponse(c, HttpStatusCodes.UNAUTHORIZED);
  const { theme } = await c.req.valid('json');
  const res = await changeUserTheme(token, theme);
  if (!res.success) return httpErrorResponse(c, res.error);
  setCookie(c, 'user_theme', theme);
  return httpSuccessResponse(c, null);
};

export default changeThemeController;
