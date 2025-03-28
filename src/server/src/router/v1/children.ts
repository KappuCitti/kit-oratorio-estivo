import deleteChildrenController from '@/controllers/children/deleteChildren';
import editChildrenController from '@/controllers/children/editChildren';
import getChildrenController from '@/controllers/children/getChildrenInfo';
import getChildrensController from '@/controllers/children/getChildrenList';
import type { HonoApp } from '@/models/app.model';
import { deleteChildRouteDef } from '@/openapi/children/deleteChildren';
import { editChildRouteDef } from '@/openapi/children/editChildren';
import { getChildInfoRouteDef } from '@/openapi/children/getChildren';
import { getChildListRouteDef } from '@/openapi/children/getChildrens';

export default (router: HonoApp) => {
  router.openapi(getChildListRouteDef, getChildrensController);
  //@ts-expect-error Type instantiation is excessively deep and possibly infinite.
  router.openapi(getChildInfoRouteDef, getChildrenController);
  router.openapi(deleteChildRouteDef, deleteChildrenController);
  router.openapi(editChildRouteDef, editChildrenController);
};
