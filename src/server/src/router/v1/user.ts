import createUsersController from '@/controllers/user/admin/createUsers';
import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import type { HonoApp } from '@/models/app.model';
import { createUsersRouteDef } from '@/openapi/user/createUsers';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';

export default (router: HonoApp) => {
  router.openapi(createUsersRouteDef, createUsersController);
  // Managed
  router.openapi(registerManagedUserRouteDef, addManagedUserController);
};
