import changePasswordController from '@/controllers/user/changePassword';
import changeThemeController from '@/controllers/user/changeTheme';
import getUserController from '@/controllers/user/getUser';
import getUsersController from '@/controllers/user/getUserList';
import type { HonoApp } from '@/models/app.model';
import { changePasswordRouteDef } from '@/openapi/user/changePassword';
import { changeUserThemeRouteDef } from '@/openapi/user/changeTheme';
import { getUserListRouteDef } from '@/openapi/user/getUsers';
import { getUserInfoRouteDef } from '@/openapi/user/userInfo';

export default (router: HonoApp) => {
  router.openapi(getUserInfoRouteDef, getUserController);

  router.openapi(getUserListRouteDef, getUsersController);

  router.openapi(changeUserThemeRouteDef, changeThemeController);
  router.openapi(changePasswordRouteDef, changePasswordController);
};
