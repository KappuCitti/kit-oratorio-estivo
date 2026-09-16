import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq, inArray } from 'drizzle-orm';
import { db } from '..';
import { classTable } from '../schema/class';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { managesTable } from '../schema/manages';
import { personalInfoTable } from '../schema/personalInfo';
import { schoolTable } from '../schema/school';
import { shirtSizeTable } from '../schema/shirt';
import { teamTable } from '../schema/team';
import { usersTable } from '../schema/user';
import { aliased } from '../utils/alias';
import { jsonObjectArray } from '../utils/jsonArray';

/**
 * Dettaglio di una singola iscrizione.
 *
 * La forma e' quella di un elemento di getEnrollmentList, piu' i campi che
 * servono solo in modifica (anno, note, maglietta) e i genitori che gestiscono
 * il ragazzo. Tenere le due forme allineate evita al client di avere due
 * modelli diversi per la stessa cosa.
 */
export async function getEnrollment(id: number) {
  const [enrollment] = await db
    .select({
      id: enrollmentTable.id,
      year: enrollmentTable.year,
      section: enrollmentTable.section,
      dataProcessingConsent: enrollmentTable.dataProcessingConsent,
      imageProcessingConsent: enrollmentTable.imageProcessingConsent,
      exitAuthorization: enrollmentTable.exitAuthorization,
      specialDiet: enrollmentTable.specialDiet,
      parentNotes: enrollmentTable.parentNotes,
      managerNotes: enrollmentTable.managerNotes,
      class: {
        id: aliased(classTable.id, 'classId'),
        name: aliased(classTable.name, 'className'),
      },
      school: {
        id: aliased(schoolTable.id, 'schoolId'),
        name: aliased(schoolTable.name, 'schoolName'),
      },
      team: {
        id: aliased(teamTable.id, 'teamId'),
        name: aliased(teamTable.name, 'teamName'),
        color: teamTable.color,
      },
      shirt: {
        id: aliased(shirtSizeTable.id, 'shirtId'),
        sizeName: shirtSizeTable.sizeName,
      },
      weeks: jsonObjectArray({
        isPaid: enrollmentWeeksTable.isPaid,
        weekId: enrollmentWeeksTable.weekId,
      }).as('weeks'),
      user: {
        id: aliased(usersTable.id, 'userId'),
        name: aliased(personalInfoTable.name, 'userName'),
        surname: personalInfoTable.surname,
        gender: personalInfoTable.gender,
        birthDate: personalInfoTable.birthDate,
        birthPlace: personalInfoTable.birthPlace,
      },
    })
    .from(enrollmentTable)
    .leftJoin(
      enrollmentWeeksTable,
      eq(enrollmentTable.id, enrollmentWeeksTable.enrollmentId)
    )
    .innerJoin(usersTable, eq(enrollmentTable.userId, usersTable.id))
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .innerJoin(classTable, eq(enrollmentTable.classId, classTable.id))
    .innerJoin(schoolTable, eq(classTable.schoolId, schoolTable.id))
    .leftJoin(teamTable, eq(enrollmentTable.teamId, teamTable.id))
    .leftJoin(
      shirtSizeTable,
      eq(enrollmentTable.shirtSizeId, shirtSizeTable.id)
    )
    .where(eq(enrollmentTable.id, id))
    .groupBy(
      enrollmentTable.id,
      enrollmentTable.year,
      enrollmentTable.section,
      enrollmentTable.dataProcessingConsent,
      enrollmentTable.imageProcessingConsent,
      enrollmentTable.exitAuthorization,
      enrollmentTable.specialDiet,
      enrollmentTable.parentNotes,
      enrollmentTable.managerNotes,
      classTable.id,
      classTable.name,
      schoolTable.id,
      schoolTable.name,
      teamTable.id,
      teamTable.name,
      teamTable.color,
      shirtSizeTable.id,
      shirtSizeTable.sizeName,
      usersTable.id,
      personalInfoTable.name,
      personalInfoTable.surname,
      personalInfoTable.gender,
      personalInfoTable.birthDate,
      personalInfoTable.birthPlace
    )
    .limit(1);

  if (!enrollment)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'enrollment_not_found');

  // MySQL restituisce i booleani dentro JSON_ARRAYAGG come 0/1.
  enrollment.weeks = enrollment.weeks.map((w) => ({
    ...w,
    isPaid: !!w.isPaid,
  }));

  const managers = await db
    .select({
      id: usersTable.id,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      email: usersTable.email,
      phone: usersTable.phone,
      gender: personalInfoTable.gender,
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .where(
      inArray(
        usersTable.id,
        db
          .select({ mainId: managesTable.mainId })
          .from(managesTable)
          .where(eq(managesTable.targetId, enrollment.user.id))
      )
    );

  return { ...enrollment, managers };
}
