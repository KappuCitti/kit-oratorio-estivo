import loginController from '@/controllers/auth/login';
import logoutController from '@/controllers/auth/logout';
import registerController from '@/controllers/auth/register';
import type { HonoApp } from '@/models/app.model';
import { loginRouteDef } from '@/openapi/auth/login';
import { logoutRouteDef } from '@/openapi/auth/logout';
import { registerRouteDef } from '@/openapi/auth/register';

export default (router: HonoApp) => {
  router.openapi(loginRouteDef, loginController);
  router.openapi(registerRouteDef, registerController);
  router.openapi(logoutRouteDef, logoutController);
};
