import { db } from '@/database';
import type { BareUser } from '@/models/user.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { roleTable, userRoleTable } from '../schema';
import { eq } from 'drizzle-orm';
import { dbLogger } from '../logger';

export async function getUserList(page: number, size: number) {
  try {
    const users = await db.query.usersTable.findMany({
      columns: { password: false, theme: false },
      limit: size,
      offset: (page - 1) * size,
    });
    const finalUsers: BareUser[] = [];
    for (const user of users) {
      finalUsers.push({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        roles: await db
          .select({
            id: roleTable.id,
            name: roleTable.name,
          })
          .from(roleTable)
          .innerJoin(userRoleTable, eq(userRoleTable.roleId, roleTable.id))
          .where(eq(userRoleTable.userId, user.id))
          .execute(),
      });
    }
    return createSuccessResult(finalUsers);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(500);
  }
}
