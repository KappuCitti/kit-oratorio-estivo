import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../..';
import { addressTable } from '../../schema/address';
import { managesTable } from '../../schema/manages';
import { personalInfoTable } from '../../schema/personalInfo';
import { roleTable } from '../../schema/role';
import { usersTable } from '../../schema/user';
import { aliased } from '../../utils/alias';

function selectPerson() {
  return db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      phone: usersTable.phone,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      gender: personalInfoTable.gender,
      birthDate: personalInfoTable.birthDate,
      birthPlace: personalInfoTable.birthPlace,
      role: {
        id: aliased(roleTable.id, 'roleId'),
        name: aliased(roleTable.name, 'roleName'),
        displayName: roleTable.displayName,
      },
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id));
}

/**
 * Dettaglio di una persona, con le relazioni in entrambi i versi.
 *
 * `managers` sono quelli che possono gestirla (per un ragazzo: i genitori),
 * `managed` quelle che lei gestisce (per un genitore: i figli). La tabella
 * `manages` e' orientata, quindi le due liste non sono la stessa cosa.
 */
export async function getPerson(id: string) {
  const [person] = await selectPerson()
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!person)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'user_not_found');

  const [address] = await db
    .select({
      street: addressTable.street,
      city: addressTable.city,
      postalCode: addressTable.postalCode,
      country: addressTable.country,
    })
    .from(personalInfoTable)
    .innerJoin(addressTable, eq(personalInfoTable.addressId, addressTable.id))
    .where(eq(personalInfoTable.id, id))
    .limit(1);

  const managers = await selectPerson().where(
    inArray(
      usersTable.id,
      db
        .select({ mainId: managesTable.mainId })
        .from(managesTable)
        .where(eq(managesTable.targetId, id))
    )
  );

  const managed = await selectPerson().where(
    inArray(
      usersTable.id,
      db
        .select({ targetId: managesTable.targetId })
        .from(managesTable)
        .where(eq(managesTable.mainId, id))
    )
  );

  return { ...person, address: address ?? null, managers, managed };
}
