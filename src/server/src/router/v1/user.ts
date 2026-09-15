import createUserController from '@/controllers/user/admin/createUser';
import createUsersController from '@/controllers/user/admin/createUsers';
import changePasswordController from '@/controllers/user/changePassword';
import changeThemeController from '@/controllers/user/changeTheme';
import getSelfInfoController from '@/controllers/user/getSelfInfo';
import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import getManagedUsersController from '@/controllers/user/managed/getManagedUsers';
import type { HonoApp } from '@/models/app.model';
import { createUserRouteDef } from '@/openapi/user/createUser';
import { createUsersRouteDef } from '@/openapi/user/createUsers';
import { getManagedUserListRouteDef } from '@/openapi/user/getManagedUsers';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';
import { getSelfInfoRouteDef } from '@/openapi/user/getSelfInfo';
import { changePasswordRouteDef } from '@/openapi/user/changePassword';
import { changeUserThemeRouteDef } from '@/openapi/user/changeTheme';

export default (router: HonoApp) => {
  router.openapi(createUsersRouteDef, createUsersController);
  router.openapi(getSelfInfoRouteDef, getSelfInfoController);
  // Self
  router.openapi(changePasswordRouteDef, changePasswordController);
  router.openapi(changeUserThemeRouteDef, changeThemeController);
  // Managed
  router.openapi(registerManagedUserRouteDef, addManagedUserController);
  router.openapi(getManagedUserListRouteDef, getManagedUsersController);
  router.openapi(createUserRouteDef, createUserController);
};
