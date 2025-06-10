import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { and, eq } from 'drizzle-orm';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { addressTable } from '../schema/address';
import { roleTable } from '../schema/role';

export async function getUserFromNameSurname(name: string, surname: string) {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: personalInfoTable.name,
        surname: personalInfoTable.surname,
        birthDate: personalInfoTable.birthDate,
        gender: personalInfoTable.gender,
        birthPlace: personalInfoTable.birthPlace,
        address: {
          street: addressTable.street,
          city: addressTable.city,
          postalCode: addressTable.postalCode,
          country: addressTable.country,
        },
        role: {
          id: roleTable.id,
          name: roleTable.name,
        },
      })
      .from(usersTable)
      .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
      .leftJoin(addressTable, eq(personalInfoTable.addressId, addressTable.id))
      .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
      .where(
        and(
          eq(personalInfoTable.name, name),
          eq(personalInfoTable.surname, surname)
        )
      )
      .limit(1)
      .execute();
    return createSuccessResult(users.at(0));
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserFromEmail(email: string) {
  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      birthDate: personalInfoTable.birthDate,
      gender: personalInfoTable.gender,
      birthPlace: personalInfoTable.birthPlace,
      address: {
        street: addressTable.street,
        city: addressTable.city,
        postalCode: addressTable.postalCode,
        country: addressTable.country,
      },
      role: {
        id: roleTable.id,
        name: roleTable.name,
      },
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .leftJoin(addressTable, eq(personalInfoTable.addressId, addressTable.id))
    .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
    .where(eq(usersTable.email, email))
    .limit(1)
    .execute();
  return users.at(0);
}
