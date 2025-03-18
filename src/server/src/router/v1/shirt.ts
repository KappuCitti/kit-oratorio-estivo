import createShirtController from '@/controllers/shirt/createShirt';
import getShirtsController from '@/controllers/shirt/getShirtList';
import type { HonoApp } from '@/models/app.model';
import { createShirtRouteDef } from '@/openapi/shirt/createShirt';
import { getShirtListRouteDef } from '@/openapi/shirt/getShirts';

export default (router: HonoApp) => {
  router.openapi(getShirtListRouteDef, getShirtsController);
  router.openapi(createShirtRouteDef, createShirtController);
};
