import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { getUserFromToken } from '../getFromToken';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '@/database/logger';
import { getUserFromEmail } from '../getUser';
import { db } from '@/database';
import { usersTable } from '@/database/schema/user';
import { eq } from 'drizzle-orm';
import { txCreateAddressIfNotExists } from '@/database/address/createAddress';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { getRoleIdIfCanRegister } from '@/database/role/canRoleRegister';

export async function addManagedUser(
  token: string,
  cf: string,
  password: string,
  name: string,
  surname: string,
  birthDate: string,
  birthPlace: string,
  sex: 'M' | 'F',
  street: string,
  city: string,
  postalCode: string,
  country: string,
  role: string,
  email?: string
) {
  try {
    const user = await getUserFromToken(token);
    if (!user.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    const roleId = await getRoleIdIfCanRegister(role);
    if (!roleId.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    if (!roleId.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);
    if (email) {
      const exists = await getUserFromEmail(email);
      if (!exists.success) return exists;
      if (exists.data) return createErrorResult(HttpStatusCodes.CONFLICT);
    }
    const cfExists = await db.query.users.findFirst({
      where: eq(usersTable.id, cf),
    });
    if (cfExists) return createErrorResult(HttpStatusCodes.CONFLICT);
    if (isNaN(new Date(birthDate).getTime()))
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    await db.transaction(async (tx) => {
      const addressId = await txCreateAddressIfNotExists(tx, {
        street,
        city,
        postalCode,
        country,
      });
      if (!addressId.success)
        return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      await tx.insert(usersTable).values({
        id: cf,
        password,
        theme: 'System',
        roleId: roleId.data as number,
        email,
      });
      await tx.insert(personalInfoTable).values({
        id: cf,
        name,
        surname,
        birthDate,
        birthPlace,
        sex,
        addressId: addressId.data,
      });
    });
    return createSuccessResult(null);
  } catch (error) {
    dbLogger.error(error);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
