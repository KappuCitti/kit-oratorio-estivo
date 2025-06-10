import { HttpStatusCodes } from '@/codes';
import { changePassword } from '@/database/user/changePassword';
import { getUserMessage } from '@/localization';
import type { RouteController } from '@/models/app.model';
import type { ChangePasswordRoute } from '@/openapi/user/changePassword';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const changePasswordController: RouteController<ChangePasswordRoute> = async (
  c
) => {
  const token = getCookie(c, 'user_token');
  if (!token)
    return httpErrorResponse(c, HttpStatusCodes.UNAUTHORIZED, 'Missing token');
  const { oldPassword, newPassword } = await c.req.valid('json');
  if (oldPassword === newPassword)
    return httpErrorResponse(
      c,
      HttpStatusCodes.BAD_REQUEST,
      getUserMessage(c, 'same_password')
    );
  await changePassword(token, oldPassword, newPassword);
  return httpSuccessResponse(c, null);
};

export default changePasswordController;
