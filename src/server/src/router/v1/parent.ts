import getParentsController from '@/controllers/parent/getParentList';
import type { HonoApp } from '@/models/app.model';
import { getParentListRouteDef } from '@/openapi/parent/getParents';

export default (router: HonoApp) => {
  router.openapi(getParentListRouteDef, getParentsController);
};
