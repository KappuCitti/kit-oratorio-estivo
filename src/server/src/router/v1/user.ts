import createUserController from '@/controllers/user/admin/createUser';
import createUsersController from '@/controllers/user/admin/createUsers';
import changePasswordController from '@/controllers/user/changePassword';
import changeThemeController from '@/controllers/user/changeTheme';
import getSelfInfoController from '@/controllers/user/getSelfInfo';
import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import getManagedUsersController from '@/controllers/user/managed/getManagedUsers';
import { changePasswordRouteDef } from '@/openapi/user/changePassword';
import { changeUserThemeRouteDef } from '@/openapi/user/changeTheme';
import { createUserRouteDef } from '@/openapi/user/createUser';
import { createUsersRouteDef } from '@/openapi/user/createUsers';
import { getManagedUserListRouteDef } from '@/openapi/user/getManagedUsers';
import { getSelfInfoRouteDef } from '@/openapi/user/getSelfInfo';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(createUsersRouteDef, createUsersController)
  .openapi(getSelfInfoRouteDef, getSelfInfoController)
  // Self
  .openapi(changePasswordRouteDef, changePasswordController)
  .openapi(changeUserThemeRouteDef, changeThemeController)
  // Managed
  .openapi(registerManagedUserRouteDef, addManagedUserController)
  .openapi(getManagedUserListRouteDef, getManagedUsersController)
  .openapi(createUserRouteDef, createUserController);
