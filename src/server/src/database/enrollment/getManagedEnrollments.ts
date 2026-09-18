import { and, eq, inArray } from 'drizzle-orm';
import { db } from '..';
import { classTable } from '../schema/class';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { personalInfoTable } from '../schema/personalInfo';
import { schoolTable } from '../schema/school';
import { usersTable } from '../schema/user';
import { getManagedUsers } from '../user/managed/getManagedUsers';

export type ManagedEnrollmentStatus = 'enrolled' | 'pending' | 'none';

/**
 * Lo stato di iscrizione, nell'anno indicato, di ogni persona gestita da
 * `userId`.
 *
 * E' la vista del genitore: GET /enrollments richiede `see_users` e restituisce
 * tutte le iscrizioni dell'oratorio, quindi non poteva servire. Prima la pagina
 * "Le mie iscrizioni" mostrava dati inventati nel codice.
 *
 * Una persona e' `enrolled` se ha un'iscrizione confermata, `pending` se ha
 * solo una richiesta in coda, `none` altrimenti. Le settimane pagate hanno
 * senso solo per le iscrizioni confermate: per una richiesta `isPaid` e' null.
 */
export async function getManagedEnrollments(userId: string, year: number) {
  return await getEnrollmentStatuses(await getManagedUsers(userId), year);
}

/**
 * Lo stato di iscrizione di chi e' collegato: la vista del ragazzo.
 *
 * Se chi lo gestisce non gli mostra i pagamenti, `isPaid` torna null: il
 * filtro sta qui e non nell'interfaccia, altrimenti l'informazione resterebbe
 * leggibile nella risposta.
 */
export async function getOwnEnrollment(userId: string, year: number) {
  const [persona] = await db
    .select({
      id: usersTable.id,
      name: personalInfoTable.name,
      surname: personalInfoTable.surname,
      gender: personalInfoTable.gender,
      showPayments: usersTable.showPayments,
    })
    .from(usersTable)
    .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
    .where(eq(usersTable.id, userId));

  const [stato] = await getEnrollmentStatuses([persona], year);
  if (persona.showPayments) return stato;
  return {
    ...stato,
    weeks: stato.weeks.map((w) => ({ weekId: w.weekId, isPaid: null })),
  };
}

type Person = {
  id: string;
  name: string;
  surname: string;
  gender: 'M' | 'F' | null;
};

async function getEnrollmentStatuses(people: Person[], year: number) {
  if (people.length === 0) return [];
  const ids = people.map((p) => p.id);

  const enrollments = await db
    .select({
      id: enrollmentTable.id,
      userId: enrollmentTable.userId,
      section: enrollmentTable.section,
      classId: classTable.id,
      className: classTable.name,
      schoolId: schoolTable.id,
      schoolName: schoolTable.name,
    })
    .from(enrollmentTable)
    .innerJoin(classTable, eq(enrollmentTable.classId, classTable.id))
    .innerJoin(schoolTable, eq(classTable.schoolId, schoolTable.id))
    .where(
      and(inArray(enrollmentTable.userId, ids), eq(enrollmentTable.year, year))
    );

  const requests = await db
    .select({
      id: enrollmentQueueTable.id,
      userId: enrollmentQueueTable.userId,
      section: enrollmentQueueTable.section,
      classId: classTable.id,
      className: classTable.name,
      schoolId: schoolTable.id,
      schoolName: schoolTable.name,
    })
    .from(enrollmentQueueTable)
    .innerJoin(classTable, eq(enrollmentQueueTable.classId, classTable.id))
    .innerJoin(schoolTable, eq(classTable.schoolId, schoolTable.id))
    .where(
      and(
        inArray(enrollmentQueueTable.userId, ids),
        eq(enrollmentQueueTable.year, year)
      )
    );

  const enrollmentWeeks = enrollments.length
    ? await db
        .select()
        .from(enrollmentWeeksTable)
        .where(
          inArray(
            enrollmentWeeksTable.enrollmentId,
            enrollments.map((e) => e.id)
          )
        )
    : [];

  const requestWeeks = requests.length
    ? await db
        .select()
        .from(enrollmentQueueWeeksTable)
        .where(
          inArray(
            enrollmentQueueWeeksTable.enrollmentId,
            requests.map((r) => r.id)
          )
        )
    : [];

  return people.map((person) => {
    const persona = {
      id: person.id,
      name: person.name,
      surname: person.surname,
      gender: person.gender,
    };

    const enrollment = enrollments.find((e) => e.userId === person.id);
    if (enrollment) {
      return {
        user: persona,
        status: 'enrolled' as ManagedEnrollmentStatus,
        class: { id: enrollment.classId, name: enrollment.className },
        school: { id: enrollment.schoolId, name: enrollment.schoolName },
        section: enrollment.section,
        weeks: enrollmentWeeks
          .filter((w) => w.enrollmentId === enrollment.id)
          .map((w) => ({ weekId: w.weekId, isPaid: w.isPaid as boolean | null })),
      };
    }

    const request = requests.find((r) => r.userId === person.id);
    if (request) {
      return {
        user: persona,
        status: 'pending' as ManagedEnrollmentStatus,
        class: { id: request.classId, name: request.className },
        school: { id: request.schoolId, name: request.schoolName },
        section: request.section,
        weeks: requestWeeks
          .filter((w) => w.enrollmentId === request.id)
          .map((w) => ({ weekId: w.weekId, isPaid: null as boolean | null })),
      };
    }

    return {
      user: persona,
      status: 'none' as ManagedEnrollmentStatus,
      class: null,
      school: null,
      section: null,
      weeks: [] as { weekId: number; isPaid: boolean | null }[],
    };
  });
}
