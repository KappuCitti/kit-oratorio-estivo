import { db } from '@/database';
import { dbLogger } from '@/database/logger';
import { managesTable } from '@/database/schema/manages';
import { rolePermissionTable } from '@/database/schema/rolePermission';
import { sessionTable } from '@/database/schema/session';
import { usersTable } from '@/database/schema/user';
import { now } from '@/database/utils/now';
import { and, eq, gt } from 'drizzle-orm';

export async function canUserManageFromToken(token: string, targetId: string) {
  dbLogger.debug('Checking if user can manage with %s, %s', token, targetId);
  const [result] = await db
    .select({ userId: usersTable.id })
    .from(usersTable)
    .innerJoin(sessionTable, eq(usersTable.id, sessionTable.userId))
    .innerJoin(
      rolePermissionTable,
      eq(usersTable.roleId, rolePermissionTable.roleId)
    )
    .where(
      and(
        eq(sessionTable.token, token),
        gt(sessionTable.expires, now()),
        eq(rolePermissionTable.permission, 'manage_self_child_users')
      )
    )
    .limit(1);
  dbLogger.debug('User can manage: %s', result?.userId ?? 'NOT FOUND');
  if (!result) return false;
  dbLogger.debug('Checking if user can manage target');
  const targets = await db
    .select()
    .from(managesTable)
    .where(
      and(
        eq(managesTable.mainId, result.userId),
        eq(managesTable.targetId, targetId)
      )
    )
    .limit(1);
  dbLogger.debug(
    'User can manage target: %s',
    targets.length > 0 ? 'YES' : 'NO'
  );
  return targets.length > 0;
}
