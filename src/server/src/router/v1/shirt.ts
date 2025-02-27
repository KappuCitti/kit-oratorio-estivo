import getShirtsController from '@/controllers/shirt/getShirtList';
import type { HonoApp } from '@/models/app.model';
import { getShirtListRouteDef } from '@/openapi/shirt/getShirts';

export default (router: HonoApp) => {
  router.openapi(getShirtListRouteDef, getShirtsController);
};
