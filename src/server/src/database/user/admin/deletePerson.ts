import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { count, eq } from 'drizzle-orm';
import { db } from '../..';
import { managesTable } from '../../schema/manages';
import { usersTable } from '../../schema/user';

/**
 * Cancella una persona.
 *
 * Le iscrizioni, le presenze, le sessioni e le righe di `manages` che la
 * riguardano se ne vanno con lei, perche' hanno ON DELETE CASCADE.
 *
 * Il caso che va fermato e' un altro: cancellare un genitore che e' l'unico a
 * gestire un minore lo lascerebbe senza nessuno che possa vederne i dati o
 * iscriverlo. In quel caso si rifiuta, e chi cancella deve prima assegnare un
 * altro responsabile.
 */
export async function deletePerson(id: string) {
  const exists = !!(await db.query.users.findFirst({
    where: eq(usersTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'user_not_found');

  const gestiti = await db
    .select({ targetId: managesTable.targetId })
    .from(managesTable)
    .where(eq(managesTable.mainId, id));

  for (const { targetId } of gestiti) {
    const [altri] = await db
      .select({ count: count() })
      .from(managesTable)
      .where(eq(managesTable.targetId, targetId));

    if (altri.count <= 1) {
      throw new DatabaseError(
        HttpStatusCodes.CONFLICT,
        'last_manager_of_user'
      );
    }
  }

  await db.delete(usersTable).where(eq(usersTable.id, id));
}
