import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { usersTable } from '../schema/user';
import { DatabaseError } from '@/errors/database';

export async function getUserRole(userId: string) {
  const role = await db.query.users.findFirst({
    columns: { roleId: true },
    where: eq(usersTable.id, userId),
  });
  if (!role)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'user_not_found');
  return role.roleId;
}
