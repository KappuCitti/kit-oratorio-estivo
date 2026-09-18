import { getUserFromToken } from '@/database/user/getFromToken';
import { setShowPayments } from '@/database/user/managed/setShowPayments';
import type { RouteController } from '@/models/app.model';
import type { SetShowPaymentsRoute } from '@/openapi/user/setShowPayments';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const setShowPaymentsController: RouteController<SetShowPaymentsRoute> = async (
  c
) => {
  const { id } = c.req.valid('param');
  const { showPayments } = c.req.valid('json');
  const token = getCookie(c, 'user_token') as string;
  const user = await getUserFromToken(token);
  await setShowPayments(user.id, id, showPayments);
  return httpSuccessResponse(c, null);
};

export default setShowPaymentsController;
