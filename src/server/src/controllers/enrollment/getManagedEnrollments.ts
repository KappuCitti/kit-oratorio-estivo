import { getManagedEnrollments } from '@/database/enrollment/getManagedEnrollments';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { GetManagedEnrollmentsRoute } from '@/openapi/enrollment/getManagedEnrollments';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getManagedEnrollmentsController: RouteController<
  GetManagedEnrollmentsRoute
> = async (c) => {
  const { year } = c.req.valid('query');
  const token = getCookie(c, 'user_token') as string;
  const user = await getUserFromToken(token);
  const res = await getManagedEnrollments(user.id, year);
  return httpSuccessResponse(c, res);
};

export default getManagedEnrollmentsController;
