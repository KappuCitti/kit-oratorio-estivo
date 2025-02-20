import { mainRouteDef } from '@/openapi/main';
import type { HonoApp } from '@/models/app.model';
import mainController from '@/controllers/main';

export default (router: HonoApp) => {
  router.openapi(mainRouteDef, mainController);
};
