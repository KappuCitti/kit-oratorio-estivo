import { HttpStatusCodes } from '@/codes';
import config from '@/config';
import { db } from '@/database';
import { roleTable } from '@/database/schema/role';
import { rolePermissionTable } from '@/database/schema/rolePermission';
import { sessionTable } from '@/database/schema/session';
import { usersTable } from '@/database/schema/user';
import type { Bindings } from '@/models/app.model';
import type { Permission } from '@/models/permissions.model';
import { httpErrorResponse } from '@/utils/responses';
import { and, eq, gt } from 'drizzle-orm';
import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';

/**
 * Il permesso richiesto resta leggibile dall'esterno come `.permission` sul
 * middleware restituito.
 *
 * Serve a generare in automatico la mappa rotta -> permesso che usa il client:
 * senza questo, l'unico modo per sapere cosa protegge una rotta sarebbe
 * rileggere il sorgente con una regex, oppure riscrivere la stessa lista a mano
 * nel client e vederla divergere al primo cambio.
 */
export type PermissionMiddleware = ((
  c: Context<Bindings, any, {}>,
  next: Next
) => Promise<Response | void>) & { readonly permission: Permission };

export function can(permission: Permission): PermissionMiddleware {
  const middleware = async (c: Context<Bindings, any, {}>, next: Next) => {
    if (config.development.isDev && config.development.ignorePermissions) {
      return next();
    }
    const token = getCookie(c, 'user_token');
    if (!token)
      return httpErrorResponse(
        c,
        HttpStatusCodes.UNAUTHORIZED,
        'Missing token'
      );
    const permissionsRes = await db
      .select({
        permission: rolePermissionTable.permission,
      })
      .from(sessionTable)
      .innerJoin(usersTable, eq(usersTable.id, sessionTable.userId))
      .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
      .innerJoin(
        rolePermissionTable,
        eq(rolePermissionTable.roleId, roleTable.id)
      )
      .where(
        and(eq(sessionTable.token, token), gt(sessionTable.expires, new Date()))
      );
    if (permissionsRes.length === 0)
      return httpErrorResponse(
        c,
        HttpStatusCodes.UNAUTHORIZED,
        'Missing token'
      );
    if (!permissionsRes) {
      return httpErrorResponse(
        c,
        HttpStatusCodes.UNAUTHORIZED,
        'Missing token'
      );
    }
    const permissions = permissionsRes.map((p) => p.permission);
    if (!permissions.includes(permission))
      return httpErrorResponse(
        c,
        HttpStatusCodes.FORBIDDEN,
        'Missing permission'
      );
    return next();
  };

  return Object.assign(middleware, { permission } as const);
}
