import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { dbLogger } from '@/database/logger';
import { usersTable } from '@/database/schema/user';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { eq } from 'drizzle-orm';
import { getUserFromEmail } from '../getUser';
import { isValidRole } from '@/database/role/isValid';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { txCreateAddressIfNotExists } from '@/database/address/createAddress';
import { hashPassword } from '@/utils/password';

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
  try {
    const exists = !!(await db.query.users.findFirst({
      where: eq(usersTable.id, cf),
    }));
    if (exists) return createErrorResult(HttpStatusCodes.CONFLICT);
    if (email) {
      const emailExists = await getUserFromEmail(email);
      if (!emailExists.success) return emailExists;
      if (emailExists.data) return createErrorResult(HttpStatusCodes.CONFLICT);
    }
    const roleExists = await isValidRole(roleId);
    if (!roleExists.success) return roleExists;
    if (!roleExists.data) return createErrorResult(HttpStatusCodes.BAD_REQUEST);

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
        if (!addressId.success)
          return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        await tx.insert(personalInfoTable).values({
          id: cf,
          name,
          surname,
          birthDate,
          birthPlace,
          gender,
          addressId: addressId.data,
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
      return createSuccessResult(null);
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
