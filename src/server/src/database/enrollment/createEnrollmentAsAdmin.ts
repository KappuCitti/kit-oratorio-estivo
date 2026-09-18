import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import type { WeekEnrollment } from '@/models/week.model';
import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { isValidClass } from '../class/isValid';
import { hasPermission } from '../permissions/hasPermission';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { shirtSizeTable } from '../schema/shirt';
import { teamTable } from '../schema/team';
import { checkRestrictions } from '../week/checkRestrictions';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { getWeeksYear } from '../week/getWeeksYear';

export interface AdminEnrollmentData {
  userId: string;
  classId: number;
  section: string;
  weeks: WeekEnrollment[];
  team?: number | null;
  shirt?: number | null;
  dataProcessingConsent: boolean;
  imageProcessingConsent: boolean;
  exitAuthorization?: boolean | null;
  parentNotes?: string | null;
  managerNotes?: string | null;
  specialDiet?: string | null;
  /**
   * Salta la finestra di iscrizione e il limite di posti.
   *
   * E' la cosiddetta iscrizione "super": serve allo sportello, quando qualcuno
   * si presenta di persona a iscrizioni chiuse o a settimana piena e si decide
   * comunque di accettarlo. I controlli di integrita' NON vengono mai saltati:
   * la classe, la squadra, la maglietta e le settimane devono esistere, e non
   * si puo' iscrivere due volte la stessa persona per lo stesso anno.
   */
  ignoreRestrictions?: boolean;
}

/**
 * Crea un'iscrizione direttamente, senza passare dalla coda.
 *
 * La coda (POST /enrollments/queue) e' il percorso del genitore: chiede, e un
 * responsabile approva. Questa rotta e' il percorso dello sportello, dove
 * l'iscrizione viene registrata sul momento. Un amministratore non puo' usare
 * la coda al posto del genitore, perche' quella pretende che chi invia GESTISCA
 * il ragazzo (`canUserManage`), e un amministratore non gestisce i figli altrui.
 */
export async function createEnrollmentAsAdmin(data: AdminEnrollmentData) {
  const canBeEnrolled = await hasPermission(data.userId, 'be_enrolled');
  if (!canBeEnrolled)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_enroll');

  const validClass = await isValidClass(data.classId);
  if (!validClass)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'class_not_found');

  if (data.weeks.length === 0)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  const weekIds = data.weeks.map((w) => w.id);
  const validWeeks = await checkValidWeeks(weekIds);
  if (!validWeeks)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  if (data.team) {
    const validTeam = !!(await db.query.teams.findFirst({
      where: eq(teamTable.id, data.team),
    }));
    if (!validTeam)
      throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'team_not_found');
  }

  if (data.shirt) {
    const validShirt = !!(await db.query.shirts.findFirst({
      where: eq(shirtSizeTable.id, data.shirt),
    }));
    if (!validShirt)
      throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'shirt_not_found');
  }

  // getWeeksYear rifiuta gia' le settimane a cavallo di due anni.
  const year = await getWeeksYear(weekIds);

  const alreadyEnrolled = !!(await db.query.enrollments.findFirst({
    where: and(
      eq(enrollmentTable.userId, data.userId),
      eq(enrollmentTable.year, year)
    ),
  }));
  if (alreadyEnrolled)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_already_enrolled');

  if (!data.ignoreRestrictions) {
    await checkRestrictions(weekIds);
  }

  return await db.transaction(async (tx) => {
    const [enrollment] = await tx
      .insert(enrollmentTable)
      .values({
        userId: data.userId,
        teamId: data.team ?? null,
        shirtSizeId: data.shirt ?? null,
        classId: data.classId,
        section: data.section,
        year,
        dateOfEnrollment: new Date(),
        dataProcessingConsent: data.dataProcessingConsent,
        imageProcessingConsent: data.imageProcessingConsent,
        exitAuthorization: data.exitAuthorization ?? false,
        parentNotes: data.parentNotes ?? null,
        managerNotes: data.managerNotes ?? null,
        specialDiet: data.specialDiet ?? null,
      })
      .$returningId();

    await tx.insert(enrollmentWeeksTable).values(
      data.weeks.map((week) => ({
        enrollmentId: enrollment.id,
        weekId: week.id,
        isPaid: week.isPaid,
      }))
    );

    return enrollment.id;
  });
}
