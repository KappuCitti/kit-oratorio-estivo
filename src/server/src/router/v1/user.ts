import getUserController from '@/controllers/user/getUser';
import getUsersController from '@/controllers/user/getUserList';
import type { HonoApp } from '@/models/app.model';
import { getUserListRouteDef } from '@/openapi/user/getUsers';
import { getUserInfoRouteDef } from '@/openapi/user/userInfo';

export default (router: HonoApp) => {
  router.openapi(getUserInfoRouteDef, getUserController);

  router.openapi(getUserListRouteDef, getUsersController);
};
