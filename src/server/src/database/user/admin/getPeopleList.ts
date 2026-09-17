import { and, count, eq, like, or, type SQL } from 'drizzle-orm';
import { db } from '../..';
import { personalInfoTable } from '../../schema/personalInfo';
import { roleTable } from '../../schema/role';
import { usersTable } from '../../schema/user';
import { aliased } from '../../utils/alias';

/**
 * Elenco delle persone registrate, con ricerca e paginazione.
 *
 * E' la rubrica dell'amministratore. Non va confusa con GET /users, che
 * restituisce le sole persone GESTITE da chi e' collegato (i propri figli) e
 * non accetta filtri.
 */
export async function getPeopleList(
  page: number,
  size: number,
  query?: string,
  gender?: 'M' | 'F',
  roleId?: number
) {
  const filters: SQL[] = [];

  if (query) {
    filters.push(
      or(
        like(personalInfoTable.name, `%${query}%`),
        like(personalInfoTable.surname, `%${query}%`),
        like(usersTable.id, `%${query}%`)
      ) as SQL
    );
  }
  if (gender) filters.push(eq(personalInfoTable.gender, gender));
  if (roleId) filters.push(eq(usersTable.roleId, roleId));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const [totale] = await db
    .select({ count: count() })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .where(where);

  const elements = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      phone: usersTable.phone,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      gender: personalInfoTable.gender,
      birthDate: personalInfoTable.birthDate,
      role: {
        id: aliased(roleTable.id, 'roleId'),
        name: aliased(roleTable.name, 'roleName'),
        displayName: roleTable.displayName,
      },
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .innerJoin(roleTable, eq(usersTable.roleId, roleTable.id))
    .where(where)
    .orderBy(personalInfoTable.surname, personalInfoTable.name)
    .limit(size)
    .offset((page - 1) * size);

  return { elements, count: totale.count };
}
