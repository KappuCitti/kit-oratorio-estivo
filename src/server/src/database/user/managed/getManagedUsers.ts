import { db } from '@/database';
import { managesTable } from '@/database/schema/manages';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { roleTable } from '@/database/schema/role';
import { usersTable } from '@/database/schema/user';
import { aliased } from '@/database/utils/alias';
import { eq, inArray } from 'drizzle-orm';

export async function getManagedUsers(userId: string) {
  const users = await db
    .select({
      id: usersTable.id,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      email: usersTable.email,
      phone: usersTable.phone,
      birthDate: personalInfoTable.birthDate,
      birthPlace: personalInfoTable.birthPlace,
      gender: personalInfoTable.gender,
      role: {
        id: aliased(roleTable.id, 'roleId'),
        name: aliased(roleTable.name, 'roleName'),
        displayName: roleTable.displayName,
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
      )
    );

  return users;
}
