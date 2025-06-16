import createUserController from '@/controllers/user/admin/createUser';
import createUsersController from '@/controllers/user/admin/createUsers';
import getSelfInfoController from '@/controllers/user/getSelfInfo';
import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import getManagedUsersController from '@/controllers/user/managed/getManagedUsers';
import type { HonoApp } from '@/models/app.model';
import { createUserRouteDef } from '@/openapi/user/createUser';
import { createUsersRouteDef } from '@/openapi/user/createUsers';
import { getManagedUserListRouteDef } from '@/openapi/user/getManagedUsers';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';
import { getSelfInfoRouteDef } from '@/openapi/user/getSelfInfo';

export default (router: HonoApp) => {
  router.openapi(createUsersRouteDef, createUsersController);
  router.openapi(getSelfInfoRouteDef, getSelfInfoController);
  // Managed
  router.openapi(registerManagedUserRouteDef, addManagedUserController);
  router.openapi(getManagedUserListRouteDef, getManagedUsersController);
  router.openapi(createUserRouteDef, createUserController);
};
