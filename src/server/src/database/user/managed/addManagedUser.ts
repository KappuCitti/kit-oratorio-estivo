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
import { managesTable } from '@/database/schema/manages';
import { getRoleIdIfCan } from '@/database/role/roleHasPermission';
import { hashPassword } from '@/utils/password';
import { DatabaseError } from '@/errors/database';

export async function addManagedUser(
  token: string,
  cf: string,
  password: string,
  name: string,
  surname: string,
  birthDate: string,
  birthPlace: string,
  gender: 'M' | 'F',
  street: string,
  city: string,
  postalCode: string,
  country: string,
  role: string,
  email?: string
) {
  const user = await getUserFromToken(token);
  dbLogger.debug('Found user: %s', user.id);
  dbLogger.debug('Getting user role');
  const roleId = await getRoleIdIfCan(role, 'be_enrolled');
  if (!roleId)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'role_cant_be_enrolled');
  if (email) {
    dbLogger.debug('Checking if email is already used');
    const exists = await getUserFromEmail(email);
    if (exists)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_email_exists');
  }
  dbLogger.debug('Checking if user CF is already used');
  const cfExists = await db.query.users.findFirst({
    where: eq(usersTable.id, cf),
  });
  if (cfExists)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_cf_exists');
  if (isNaN(new Date(birthDate).getTime()))
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_date');
  await db.transaction(async (tx) => {
    dbLogger.debug('Creating address');
    const addressId = await txCreateAddressIfNotExists(tx, {
      street,
      city,
      postalCode,
      country,
    });
    dbLogger.debug('Creating user');
    await tx.insert(usersTable).values({
      id: cf,
      password: await hashPassword(password),
      theme: 'System',
      roleId: roleId,
      email,
    });
    dbLogger.debug('Creating personal info');
    await tx.insert(personalInfoTable).values({
      id: cf,
      name,
      surname,
      birthDate,
      birthPlace,
      gender,
      addressId,
    });
    dbLogger.debug('Linking users');
    await tx.insert(managesTable).values({
      mainId: user.id,
      targetId: cf,
    });
  });
}
