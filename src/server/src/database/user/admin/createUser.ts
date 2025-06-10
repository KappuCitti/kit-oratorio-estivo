import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { usersTable } from '@/database/schema/user';
import { eq } from 'drizzle-orm';
import { getUserFromEmail } from '../getUser';
import { isValidRole } from '@/database/role/isValid';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { txCreateAddressIfNotExists } from '@/database/address/createAddress';
import { hashPassword } from '@/utils/password';
import { DatabaseError } from '@/errors/database';

export async function createUser(
  cf: string,
  password: string,
  name: string,
  surname: string,
  roleId: number,
  gender: 'M' | 'F',
  birthDate?: string,
  birthPlace?: string,
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  },
  email?: string,
  phone?: string
) {
  const exists = !!(await db.query.users.findFirst({
    where: eq(usersTable.id, cf),
  }));
  if (exists)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_cf_exists');
  if (email) {
    const emailExists = await getUserFromEmail(email);
    if (emailExists)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_email_exists');
  }
  const roleExists = await isValidRole(roleId);
  if (!roleExists)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'role_invalid');

  return await db.transaction(async (tx) => {
    await tx.insert(usersTable).values({
      id: cf,
      password: await hashPassword(password),
      theme: 'System',
      roleId,
      email,
      phone,
    });
    if (address) {
      const addressId = await txCreateAddressIfNotExists(tx, address);
      await tx.insert(personalInfoTable).values({
        id: cf,
        name,
        surname,
        birthDate,
        birthPlace,
        gender,
        addressId: addressId,
      });
    } else {
      await tx.insert(personalInfoTable).values({
        id: cf,
        name,
        surname,
        birthDate,
        birthPlace,
        gender,
      });
    }
  });
}
