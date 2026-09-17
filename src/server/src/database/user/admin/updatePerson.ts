import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { and, eq, ne } from 'drizzle-orm';
import { db } from '../..';
import { txCreateAddressIfNotExists } from '../../address/createAddress';
import { isValidRole } from '../../role/isValid';
import { personalInfoTable } from '../../schema/personalInfo';
import { usersTable } from '../../schema/user';

export interface UpdatePersonData {
  name?: string;
  surname?: string;
  gender?: 'M' | 'F';
  birthDate?: string | null;
  birthPlace?: string | null;
  email?: string | null;
  phone?: string | null;
  roleId?: number;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  } | null;
}

export async function updatePerson(id: string, data: UpdatePersonData) {
  const exists = !!(await db.query.users.findFirst({
    where: eq(usersTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'user_not_found');

  // L'email e' unica fra gli utenti: senza questo controllo l'aggiornamento
  // fallirebbe con un errore del database invece che con un messaggio chiaro.
  if (data.email) {
    const inUso = !!(await db.query.users.findFirst({
      where: and(eq(usersTable.email, data.email), ne(usersTable.id, id)),
    }));
    if (inUso)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_email_exists');
  }

  if (data.roleId !== undefined) {
    const valido = await isValidRole(data.roleId);
    if (!valido)
      throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'role_invalid');
  }

  const cambiaUtente =
    data.email !== undefined ||
    data.phone !== undefined ||
    data.roleId !== undefined;
  const cambiaAnagrafica =
    data.name !== undefined ||
    data.surname !== undefined ||
    data.gender !== undefined ||
    data.birthDate !== undefined ||
    data.birthPlace !== undefined ||
    data.address !== undefined;

  if (!cambiaUtente && !cambiaAnagrafica)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'nothing_to_change');

  await db.transaction(async (tx) => {
    if (cambiaUtente) {
      await tx
        .update(usersTable)
        .set({
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
          ...(data.roleId !== undefined ? { roleId: data.roleId } : {}),
        })
        .where(eq(usersTable.id, id));
    }

    if (cambiaAnagrafica) {
      let addressId: number | null | undefined = undefined;
      if (data.address === null) addressId = null;
      else if (data.address)
        addressId = await txCreateAddressIfNotExists(tx, data.address);

      await tx
        .update(personalInfoTable)
        .set({
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.surname !== undefined ? { surname: data.surname } : {}),
          ...(data.gender !== undefined ? { gender: data.gender } : {}),
          ...(data.birthDate !== undefined
            ? { birthDate: data.birthDate }
            : {}),
          ...(data.birthPlace !== undefined
            ? { birthPlace: data.birthPlace }
            : {}),
          ...(addressId !== undefined ? { addressId } : {}),
        })
        .where(eq(personalInfoTable.id, id));
    }
  });
}
