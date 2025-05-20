import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { dbLogger } from '@/database/logger';
import { managesTable } from '@/database/schema/manages';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { roleTable } from '@/database/schema/role';
import { usersTable } from '@/database/schema/user';
import { aliased } from '@/database/utils/alias';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { eq, inArray } from 'drizzle-orm';

export async function getManagedUsers(userId: string) {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: personalInfoTable.name,
        surname: personalInfoTable.surname,
        email: usersTable.email,
        phone: usersTable.phone,
        birthDate: personalInfoTable.birthDate,
        birthPlace: personalInfoTable.birthPlace,
        sex: personalInfoTable.sex,
        role: {
          id: aliased(roleTable.id, 'roleId'),
          name: aliased(roleTable.name, 'roleName'),
        },
      })
      .from(usersTable)
      .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
      .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
      .where(
        inArray(
          usersTable.id,
          db
            .select({ targetId: managesTable.targetId })
            .from(managesTable)
            .where(eq(managesTable.mainId, userId))
            .as('manages')
        )
      );

    return createSuccessResult(users);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
