import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import type { WeekEnrollment } from '@/models/week.model';
import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { classTable } from '../schema/class';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { shirtSizeTable } from '../schema/shirt';
import { teamTable } from '../schema/team';
import { checkValidWeeks } from '../week/checkValidWeeks';

export interface EditEnrollmentData {
  team?: number | null;
  shirt?: number | null;
  weeks: WeekEnrollment[];
  dataProcessingConsent: boolean;
  exitAuthorization: boolean;
  schoolId: number;
  classId: number;
  section: string;
  year: number;
  parentNotes?: string | null;
  managerNotes?: string | null;
}

export async function editEnrollment(id: number, data: EditEnrollmentData) {
  const exists = !!(await db.query.enrollments.findFirst({
    where: eq(enrollmentTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'enrollment_not_found');

  // La classe deve esistere ED appartenere alla scuola indicata: senza il
  // secondo controllo si potrebbe salvare una classe di un'altra scuola, e
  // l'iscrizione risulterebbe in una scuola in cui quella classe non c'e'.
  const validClass = !!(await db.query.classes.findFirst({
    where: and(
      eq(classTable.id, data.classId),
      eq(classTable.schoolId, data.schoolId)
    ),
  }));
  if (!validClass)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'class_not_found');

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

  const weeksValid = await checkValidWeeks(data.weeks.map((w) => w.id));
  if (!weeksValid)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  await db.transaction(async (tx) => {
    await tx
      .update(enrollmentTable)
      .set({
        teamId: data.team ?? null,
        shirtSizeId: data.shirt ?? null,
        dataProcessingConsent: data.dataProcessingConsent,
        exitAuthorization: data.exitAuthorization,
        classId: data.classId,
        section: data.section,
        year: data.year,
        parentNotes: data.parentNotes ?? null,
        managerNotes: data.managerNotes ?? null,
      })
      .where(eq(enrollmentTable.id, id));

    // Le settimane vengono sostituite in blocco: il client manda l'elenco
    // completo di quelle selezionate, non un delta.
    await tx
      .delete(enrollmentWeeksTable)
      .where(eq(enrollmentWeeksTable.enrollmentId, id));

    if (data.weeks.length > 0) {
      await tx.insert(enrollmentWeeksTable).values(
        data.weeks.map((w) => ({
          enrollmentId: id,
          weekId: w.id,
          isPaid: w.isPaid,
        }))
      );
    }
  });
}
