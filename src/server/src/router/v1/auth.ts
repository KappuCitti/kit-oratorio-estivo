import loginController from '@/controllers/auth/login';
import logoutController from '@/controllers/auth/logout';
import registerController from '@/controllers/auth/register';
import { loginRouteDef } from '@/openapi/auth/login';
import { logoutRouteDef } from '@/openapi/auth/logout';
import { registerRouteDef } from '@/openapi/auth/register';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(loginRouteDef, loginController)
  .openapi(registerRouteDef, registerController)
  .openapi(logoutRouteDef, logoutController);
