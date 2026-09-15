import { changeUserTheme } from '@/database/user/changeUserTheme';
import type { RouteController } from '@/models/app.model';
import type { ChangeUserThemeRoute } from '@/openapi/user/changeTheme';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie, setCookie } from 'hono/cookie';
import { THEME_COOKIE_OPTIONS } from '@/utils/cookies';

const changeThemeController: RouteController<ChangeUserThemeRoute> = async (
  c
) => {
  const token = getCookie(c, 'user_token');
  const { theme } = await c.req.valid('json');
  await changeUserTheme(token!, theme);
  setCookie(c, 'user_theme', theme, THEME_COOKIE_OPTIONS);
  return httpSuccessResponse(c, null);
};

export default changeThemeController;
