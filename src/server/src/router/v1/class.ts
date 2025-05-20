import getClassesController from '@/controllers/class/getClassList';
import type { HonoApp } from '@/models/app.model';
import { getClassListRouteDef } from '@/openapi/class/getClasses';

export default (router: HonoApp) => {
  router.openapi(getClassListRouteDef, getClassesController);
};
