import getChildrenController from '@/controllers/children/getChildrenInfo';
import getChildrensController from '@/controllers/children/getChildrenList';
import type { HonoApp } from '@/models/app.model';
import { getChildInfoRouteDef } from '@/openapi/children/getChildren';
import { getChildListRouteDef } from '@/openapi/children/getChildrens';

export default (router: HonoApp) => {
  router.openapi(getChildListRouteDef, getChildrensController);
  //? Used `as any` to avoid vscode giving `Type instantiation is excessively deep` error
  router.openapi(getChildInfoRouteDef, getChildrenController as any);
};
