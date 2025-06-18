import { HttpStatusCodes } from '@/codes';
import { getUserFromToken } from '@/database/user/getFromToken';
import type { Bindings } from '@/models/app.model';
import { httpErrorResponse } from '@/utils/responses';
import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';

export async function isLogged(c: Context<Bindings, any, {}>, next: Next) {
  const token = getCookie(c, 'user_token');
  if (!token)
    return httpErrorResponse(c, HttpStatusCodes.UNAUTHORIZED, 'Missing token');
  await getUserFromToken(token);
  return next();
}
