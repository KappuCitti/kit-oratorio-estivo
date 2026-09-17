import { getRoleList } from '@/database/role/getRoleList';
import type { RouteController } from '@/models/app.model';
import type { GetRoleListRoute } from '@/openapi/role/getRoles';
import { httpSuccessResponse } from '@/utils/responses';

const getRolesController: RouteController<GetRoleListRoute> = async (c) => {
  const roles = await getRoleList();
  return httpSuccessResponse(c, roles);
};

export default getRolesController;
