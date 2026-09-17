import getRolesController from '@/controllers/role/getRoleList';
import { getRoleListRouteDef } from '@/openapi/role/getRoles';
import { createRouter } from '@/utils/createRouter';

export default createRouter().openapi(getRoleListRouteDef, getRolesController);
