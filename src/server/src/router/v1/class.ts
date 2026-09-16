import createClassController from '@/controllers/class/createClass';
import getClassesController from '@/controllers/class/getClassList';
import { createClassRouteDef } from '@/openapi/class/createClass';
import { getClassListRouteDef } from '@/openapi/class/getClasses';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getClassListRouteDef, getClassesController)
  .openapi(createClassRouteDef, createClassController);
