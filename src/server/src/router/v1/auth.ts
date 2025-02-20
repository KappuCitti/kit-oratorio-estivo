import loginController from '@/controllers/auth/login';
import registerController from '@/controllers/auth/register';
import type { HonoApp } from '@/models/app.model';
import { loginRouteDef } from '@/openapi/auth/login';
import { registerRouteDef } from '@/openapi/auth/register';

export default (router: HonoApp) => {
  router.openapi(loginRouteDef, loginController);
  router.openapi(registerRouteDef, registerController);
};
