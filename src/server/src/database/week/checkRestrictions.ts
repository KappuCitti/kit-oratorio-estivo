import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { count, eq, inArray } from 'drizzle-orm';
import { db } from '..';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { weekTable } from '../schema/week';

/**
 * Finestra di iscrizione e posti disponibili delle settimane scelte.
 *
 * Questi due vincoli erano in tabella (`registrationOpenDate`,
 * `registrationCloseDate`, `maxEnrollments`) ma NON venivano applicati da
 * nessuna parte: si poteva iscrivere qualcuno a iscrizioni chiuse o oltre il
 * limite senza che niente se ne accorgesse.
 *
 * Valgono per le richieste dei genitori (coda) e per l'iscrizione da sportello
 * in modalita' normale. Non valgono per l'approvazione di una richiesta gia' in
 * coda: la richiesta e' stata controllata quando e' stata inviata, e approvarla
 * dopo la chiusura delle iscrizioni deve restare possibile.
 *
 * I posti contano solo le iscrizioni confermate, non le richieste in attesa.
 */
export async function checkRestrictions(weekIds: number[]) {
  // Confronto per sola data, senza orario: un'iscrizione fatta nel giorno di
  // chiusura deve passare, non essere rifiutata perche' sono le 14:30.
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const soloData = (d: Date) => {
    const copia = new Date(d);
    copia.setHours(0, 0, 0, 0);
    return copia.getTime();
  };

  const weeks = await db
    .select({
      id: weekTable.id,
      maxEnrollments: weekTable.maxEnrollments,
      registrationOpenDate: weekTable.registrationOpenDate,
      registrationCloseDate: weekTable.registrationCloseDate,
    })
    .from(weekTable)
    .where(inArray(weekTable.id, weekIds));

  for (const week of weeks) {
    if (
      soloData(week.registrationOpenDate) > oggi.getTime() ||
      soloData(week.registrationCloseDate) < oggi.getTime()
    ) {
      throw new DatabaseError(
        HttpStatusCodes.CONFLICT,
        'registration_not_open'
      );
    }

    const [iscritti] = await db
      .select({ count: count() })
      .from(enrollmentWeeksTable)
      .where(eq(enrollmentWeeksTable.weekId, week.id));

    if (iscritti.count >= week.maxEnrollments) {
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'week_full');
    }
  }
}
