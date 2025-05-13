import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import type { HonoApp } from '@/models/app.model';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';

export default (router: HonoApp) => {
  // Managed
  router.openapi(registerManagedUserRouteDef, addManagedUserController);
};
