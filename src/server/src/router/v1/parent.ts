import deleteParentController from '@/controllers/parent/deleteParent';
import editParentController from '@/controllers/parent/editParent';
import getParentController from '@/controllers/parent/getParentInfo';
import getParentsController from '@/controllers/parent/getParentList';
import type { HonoApp } from '@/models/app.model';
import { deleteParentRouteDef } from '@/openapi/parent/deleteParent';
import { editParentRouteDef } from '@/openapi/parent/editParent';
import { getParentInfoRouteDef } from '@/openapi/parent/getParent';
import { getParentListRouteDef } from '@/openapi/parent/getParents';

export default (router: HonoApp) => {
  router.openapi(getParentListRouteDef, getParentsController);
  router.openapi(getParentInfoRouteDef, getParentController);
  router.openapi(deleteParentRouteDef, deleteParentController);
  router.openapi(editParentRouteDef, editParentController);
};
