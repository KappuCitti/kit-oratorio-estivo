import { db } from '..';
import { and, eq, gt, inArray, SQL } from 'drizzle-orm';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { addressTable } from '../schema/address';
import { roleTable } from '../schema/role';
import { sessionTable } from '../schema/session';
import { now } from '../utils/now';
import { jsonArray } from '../utils/jsonArray';
import { rolePermissionTable } from '../schema/rolePermission';

function createGetUserQuery(filter: SQL | undefined) {
  return db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      birthDate: personalInfoTable.birthDate,
      gender: personalInfoTable.gender,
      birthPlace: personalInfoTable.birthPlace,
      phone: usersTable.phone,
      address: {
        street: addressTable.street,
        city: addressTable.city,
        postalCode: addressTable.postalCode,
        country: addressTable.country,
      },
      role: {
        id: roleTable.id,
        name: roleTable.name,
        displayName: roleTable.displayName,
        permissions: jsonArray(rolePermissionTable.permission),
      },
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .leftJoin(addressTable, eq(personalInfoTable.addressId, addressTable.id))
    .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
    .innerJoin(
      rolePermissionTable,
      eq(rolePermissionTable.roleId, roleTable.id)
    )
    .where(filter);
}

export async function getUserFromNameSurname(name: string, surname: string) {
  const users = await createGetUserQuery(
    and(
      eq(personalInfoTable.name, name),
      eq(personalInfoTable.surname, surname)
    )
  )
    .limit(1)
    .execute();
  return users.at(0);
}

export async function getUserFromEmail(email: string) {
  const users = await createGetUserQuery(eq(usersTable.email, email))
    .limit(1)
    .execute();
  return users.at(0);
}

export async function getUserFromCf(cf: string) {
  const users = await createGetUserQuery(eq(usersTable.id, cf))
    .limit(1)
    .execute();
  return users.at(0);
}

export async function getFullUserFromToken(token: string) {
  const users = await createGetUserQuery(
    inArray(
      usersTable.id,
      db
        .select({ userId: sessionTable.userId })
        .from(sessionTable)
        .where(
          and(eq(sessionTable.token, token), gt(sessionTable.expires, now()))
        )
    )
  );
}
