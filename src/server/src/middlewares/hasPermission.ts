import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import {
  permissionTable,
  rolePermissionTable,
  roleTable,
  sessionTable,
  userRoleTable,
} from '@/database/schema';
import type { Bindings } from '@/models/app.model';
import type { Permission } from '@/models/permissions.model';
import { httpErrorResponse } from '@/utils/responses';
import { and, eq, inArray } from 'drizzle-orm';
import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';

export function hasPermission(permission: Permission) {
  return async (c: Context<Bindings, any, {}>, next: Next) => {
    const token = getCookie(c, 'user_token');
    if (!token)
      return httpErrorResponse(
        c,
        HttpStatusCodes.UNAUTHORIZED,
        'Missing token'
      );
    const user = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.token, token),
      columns: { userId: true },
    });
    if (!user)
      return httpErrorResponse(
        c,
        HttpStatusCodes.UNAUTHORIZED,
        'Invalid token'
      );
    const hasPermission =
      (
        await db
          .select()
          .from(permissionTable)
          .innerJoin(
            rolePermissionTable,
            eq(permissionTable.id, rolePermissionTable.permissionId)
          )
          .innerJoin(
            userRoleTable,
            eq(userRoleTable.roleId, rolePermissionTable.roleId)
          )
          .where(
            and(
              eq(permissionTable.name, permission),
              eq(userRoleTable.userId, user.userId)
            )
          )
      ).length > 0;
    return hasPermission
      ? next()
      : httpErrorResponse(c, HttpStatusCodes.FORBIDDEN);
  };
}
