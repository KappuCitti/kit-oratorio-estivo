import { getFullUserFromToken } from '@/database/user/getUser';
import { getUserAreas } from '@/database/user/getUserAreas';
import type { RouteController } from '@/models/app.model';
import type { Permission } from '@/models/permissions.model';
import type { GetSelfInfoRoute } from '@/openapi/user/getSelfInfo';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getSelfInfoController: RouteController<GetSelfInfoRoute> = async (c) => {
  const token = getCookie(c, 'user_token') as string;
  const user = (await getFullUserFromToken(token))!;
  const areas = await getUserAreas(
    user.id,
    user.role.permissions as Permission[]
  );
  return httpSuccessResponse(c, { ...user, areas });
};

export default getSelfInfoController;
