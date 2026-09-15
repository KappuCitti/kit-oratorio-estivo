import { db } from '..';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { HttpStatusCodes } from '@/codes';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { getRoleIdIfCan } from '../role/roleHasPermission';
import { DatabaseError } from '@/errors/database';

/**
 * Ruolo assegnato a chi si registra da solo. Non e' scelto dal chiamante: la
 * rotta di registrazione e' pubblica e senza middleware, quindi accettare il
 * ruolo dal body rendeva l'escalation di privilegi una questione di come sono
 * seedati i dati invece che di codice.
 */
export const SELF_REGISTRATION_ROLE = 'parent';

export async function register(
  cf: string,
  name: string,
  surname: string,
  password: string,
  phone: string,
  email: string | null = null
) {
  const exists = !!(await db.query.users.findFirst({
    where: eq(usersTable.id, cf),
  }));
  if (exists) throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_exists');
  // Il ruolo deve comunque avere il permesso 'register': se qualcuno lo toglie
  // a 'parent', l'auto-registrazione si chiude invece di aprirsi.
  const roleId = await getRoleIdIfCan(SELF_REGISTRATION_ROLE, 'register');

  if (!roleId)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'role_invalid');
  await db.insert(usersTable).values({
    id: cf,
    roleId: roleId,
    email: email,
    password: await hashPassword(password),
    theme: 'System',
    phone: phone.replaceAll(' ', ''),
  });
  await db.insert(personalInfoTable).values({
    id: cf,
    name,
    surname,
  });
}
