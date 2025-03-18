import createShirtController from '@/controllers/shirt/createShirt';
import deleteShirtController from '@/controllers/shirt/deleteShirt';
import editShirtController from '@/controllers/shirt/editShirt';
import getShirtsController from '@/controllers/shirt/getShirtList';
import type { HonoApp } from '@/models/app.model';
import { createShirtRouteDef } from '@/openapi/shirt/createShirt';
import { deleteShirtRouteDef } from '@/openapi/shirt/deleteShirt';
import { editShirtRouteDef } from '@/openapi/shirt/editShirt';
import { getShirtListRouteDef } from '@/openapi/shirt/getShirts';

export default (router: HonoApp) => {
  router.openapi(getShirtListRouteDef, getShirtsController);
  router.openapi(deleteShirtRouteDef, deleteShirtController);
  router.openapi(createShirtRouteDef, createShirtController);
  router.openapi(editShirtRouteDef, editShirtController);
};
