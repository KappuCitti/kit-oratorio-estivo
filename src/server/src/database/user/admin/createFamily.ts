import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { hashPassword } from '@/utils/password';
import { inArray } from 'drizzle-orm';
import { db } from '../..';
import { txCreateAddressIfNotExists } from '../../address/createAddress';
import { isValidRole } from '../../role/isValid';
import { managesTable } from '../../schema/manages';
import { personalInfoTable } from '../../schema/personalInfo';
import { usersTable } from '../../schema/user';

export interface FamilyPerson {
  cf: string;
  password: string;
  name: string;
  surname: string;
  gender: 'M' | 'F';
  roleId: number;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  birthPlace?: string | null;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  } | null;
}

export interface CreateFamilyData {
  /** Chi gestisce: tipicamente i genitori. */
  managers: FamilyPerson[];
  /** Chi viene gestito: tipicamente i figli. */
  managed: FamilyPerson[];
}

/**
 * Crea un nucleo familiare in una sola transazione: le persone e le relazioni
 * di `manages` che le collegano.
 *
 * Esisteva gia' POST /admin/users, ma crea UNA persona alla volta e nessuna
 * relazione: inserire una famiglia significava una chiamata per persona piu'
 * una per ogni legame, senza transazione, con il rischio concreto di lasciare
 * a meta' il lavoro e dei minori senza nessuno che li gestisca.
 *
 * Ogni gestore viene collegato a ogni gestito: per una famiglia e' cio' che
 * serve, ed e' la ragione per cui l'operazione ha senso come blocco unico.
 */
export async function createFamily(data: CreateFamilyData) {
  const tutti = [...data.managers, ...data.managed];

  if (data.managed.length === 0)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'nothing_to_change');

  // I codici fiscali devono essere unici anche DENTRO la richiesta: senza
  // questo controllo la transazione fallirebbe a meta' con un errore del
  // database invece che con un messaggio comprensibile.
  const cf = tutti.map((p) => p.cf);
  if (new Set(cf).size !== cf.length)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_cf_exists');

  const gia = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(inArray(usersTable.id, cf));
  if (gia.length > 0)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_cf_exists');

  const email = tutti.map((p) => p.email).filter((e): e is string => !!e);
  if (email.length > 0) {
    if (new Set(email).size !== email.length)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_email_exists');

    const giaEmail = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(inArray(usersTable.email, email));
    if (giaEmail.length > 0)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_email_exists');
  }

  for (const persona of tutti) {
    const valido = await isValidRole(persona.roleId);
    if (!valido)
      throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'role_invalid');
  }

  await db.transaction(async (tx) => {
    for (const persona of tutti) {
      await tx.insert(usersTable).values({
        id: persona.cf,
        password: await hashPassword(persona.password),
        theme: 'System',
        roleId: persona.roleId,
        email: persona.email ?? null,
        phone: persona.phone ?? null,
      });

      const addressId = persona.address
        ? await txCreateAddressIfNotExists(tx, persona.address)
        : null;

      await tx.insert(personalInfoTable).values({
        id: persona.cf,
        name: persona.name,
        surname: persona.surname,
        gender: persona.gender,
        birthDate: persona.birthDate ?? null,
        birthPlace: persona.birthPlace ?? null,
        addressId,
      });
    }

    if (data.managers.length > 0) {
      await tx.insert(managesTable).values(
        data.managers.flatMap((manager) =>
          data.managed.map((target) => ({
            mainId: manager.cf,
            targetId: target.cf,
          }))
        )
      );
    }
  });

  return tutti.map((p) => p.cf);
}
