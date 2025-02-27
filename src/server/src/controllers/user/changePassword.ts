import { HttpStatusCodes } from '@/codes';
import { changePassword } from '@/database/user/changePassword';
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
      'New password is the same as the old one'
    );
  const res = await changePassword(token, oldPassword, newPassword);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.UNAUTHORIZED:
        return httpErrorResponse(
          c,
          HttpStatusCodes.UNAUTHORIZED,
          'Invalid or expired token'
        );
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(
          c,
          HttpStatusCodes.UNAUTHORIZED,
          'Invalid password'
        );
    }
  }
  return httpSuccessResponse(c, null);
};

export default changePasswordController;
