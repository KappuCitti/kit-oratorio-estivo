import createShirtController from '@/controllers/shirt/createShirt';
import deleteShirtController from '@/controllers/shirt/deleteShirt';
import editShirtController from '@/controllers/shirt/editShirt';
import getShirtsController from '@/controllers/shirt/getShirtList';
import { createShirtRouteDef } from '@/openapi/shirt/createShirt';
import { deleteShirtRouteDef } from '@/openapi/shirt/deleteShirt';
import { editShirtRouteDef } from '@/openapi/shirt/editShirt';
import { getShirtListRouteDef } from '@/openapi/shirt/getShirts';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getShirtListRouteDef, getShirtsController)
  .openapi(deleteShirtRouteDef, deleteShirtController)
  .openapi(createShirtRouteDef, createShirtController)
  .openapi(editShirtRouteDef, editShirtController);
