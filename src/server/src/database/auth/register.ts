import { db } from '..';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { HttpStatusCodes } from '@/codes';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { getRoleIdIfCan } from '../role/roleHasPermission';
import { DatabaseError } from '@/errors/database';

export async function register(
  cf: string,
  name: string,
  surname: string,
  password: string,
  role: string,
  phone: string,
  email: string | null = null
) {
  const exists = !!(await db.query.users.findFirst({
    where: eq(usersTable.id, cf),
  }));
  if (exists) throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_exists');
  const roleId = await getRoleIdIfCan(role, 'register');

  if (!roleId)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'role_invalid');
  await db.insert(usersTable).values({
    id: cf,
    roleId: roleId,
    email: email,
    password: await hashPassword(password),
    theme: 'System',
    phone,
  });
  await db.insert(personalInfoTable).values({
    id: cf,
    name,
    surname,
  });
}
