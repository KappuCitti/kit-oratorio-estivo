import createFamilyController from '@/controllers/family/createFamily';
import type { HonoApp } from '@/models/app.model';
import { createFamilyRouteDef } from '@/openapi/family/createFamily';

export default (router: HonoApp) => {
  router.openapi(createFamilyRouteDef, createFamilyController);
};
