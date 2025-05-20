import createClassController from '@/controllers/class/createClass';
import getClassesController from '@/controllers/class/getClassList';
import type { HonoApp } from '@/models/app.model';
import { createClassRouteDef } from '@/openapi/class/createClass';
import { getClassListRouteDef } from '@/openapi/class/getClasses';

export default (router: HonoApp) => {
  router.openapi(getClassListRouteDef, getClassesController);
  router.openapi(createClassRouteDef, createClassController);
};
