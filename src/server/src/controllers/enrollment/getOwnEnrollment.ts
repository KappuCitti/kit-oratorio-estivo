import { getOwnEnrollment } from '@/database/enrollment/getManagedEnrollments';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { RouteController } from '@/models/app.model';
import type { GetOwnEnrollmentRoute } from '@/openapi/enrollment/getManagedEnrollments';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const getOwnEnrollmentController: RouteController<
  GetOwnEnrollmentRoute
> = async (c) => {
  const { year } = c.req.valid('query');
  const token = getCookie(c, 'user_token') as string;
  const user = await getUserFromToken(token);
  return httpSuccessResponse(c, await getOwnEnrollment(user.id, year));
};

export default getOwnEnrollmentController;
