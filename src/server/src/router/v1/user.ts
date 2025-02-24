import getUserController from '@/controllers/user/getUser';
import type { HonoApp } from '@/models/app.model';
import { getUserInfoRouteDef } from '@/openapi/user/userInfo';

export default (router: HonoApp) => {
  router.openapi(getUserInfoRouteDef, getUserController);
};
