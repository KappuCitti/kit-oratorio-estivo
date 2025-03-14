import getParentController from '@/controllers/parent/getParentInfo';
import getParentsController from '@/controllers/parent/getParentList';
import type { HonoApp } from '@/models/app.model';
import { getParentInfoRouteDef } from '@/openapi/parent/getParent';
import { getParentListRouteDef } from '@/openapi/parent/getParents';

export default (router: HonoApp) => {
  router.openapi(getParentListRouteDef, getParentsController);
  router.openapi(getParentInfoRouteDef, getParentController);
};
