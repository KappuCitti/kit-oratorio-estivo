import getChildrensController from '@/controllers/children/getChildrenList';
import type { HonoApp } from '@/models/app.model';
import { getChildListRouteDef } from '@/openapi/children/getChildrens';

export default (router: HonoApp) => {
  router.openapi(getChildListRouteDef, getChildrensController);
};
