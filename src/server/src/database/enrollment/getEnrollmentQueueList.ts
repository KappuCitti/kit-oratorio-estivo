import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { schoolTable } from '../schema/school';
import { aliased } from '../utils/alias';
import { classTable } from '../schema/class';
import { jsonArray } from '../utils/jsonArray';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { and, count, desc, eq, like, or, SQL } from 'drizzle-orm';

export async function getEnrollmentQueueList(
  page: number,
  size: number,
  year: number,
  weekId: number | null = null,
  query: string | null = null,
  schoolId: number | null = null,
  classId: number | null = null
) {
  try {
    const filters: SQL[] = [eq(enrollmentQueueTable.year, year)];

    if (schoolId) filters.push(eq(classTable.schoolId, schoolId));
    if (classId) filters.push(eq(enrollmentQueueTable.classId, classId));
    if (weekId) filters.push(eq(enrollmentQueueWeeksTable.weekId, weekId));
    if (query)
      filters.push(
        or(
          like(personalInfoTable.name, `%${query}%`),
          like(personalInfoTable.surname, `%${query}%`)
        ) as SQL
      );

    const enrollmentsQuery = db
      .select({
        id: enrollmentQueueTable.id,
        class: {
          id: aliased(classTable.id, 'classId'),
          name: aliased(classTable.name, 'className'),
        },
        school: {
          id: aliased(schoolTable.id, 'schoolId'),
          name: aliased(schoolTable.name, 'schoolName'),
        },
        year: enrollmentQueueTable.year,
        dataProcessingConsent: enrollmentQueueTable.dataProcessingConsent,
        exitAuthorization: enrollmentQueueTable.exitAuthorization,
        imageProcessingConsent: enrollmentQueueTable.imageProcessingConsent,
        specialDiet: enrollmentQueueTable.specialDiet,
        weeks: jsonArray({
          weekId: enrollmentQueueWeeksTable.weekId,
        }).as('weeks'),
        user: {
          id: aliased(usersTable.id, 'userId'),
          name: aliased(personalInfoTable.name, 'userName'),
          surname: personalInfoTable.surname,
          gender: personalInfoTable.gender,
        },
      })
      .from(enrollmentQueueTable)
      .leftJoin(
        enrollmentQueueWeeksTable,
        eq(enrollmentQueueTable.id, enrollmentQueueWeeksTable.enrollmentId)
      )
      .innerJoin(usersTable, eq(enrollmentQueueTable.userId, usersTable.id))
      .innerJoin(classTable, eq(enrollmentQueueTable.classId, classTable.id))
      .innerJoin(schoolTable, eq(classTable.schoolId, schoolTable.id))
      .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
      .where(and(...filters))
      .groupBy(
        enrollmentQueueTable.id,
        schoolTable.id,
        classTable.id,
        schoolTable.name,
        classTable.name,
        enrollmentQueueTable.year,
        enrollmentQueueTable.dataProcessingConsent,
        enrollmentQueueTable.exitAuthorization,
        enrollmentQueueTable.imageProcessingConsent,
        enrollmentQueueTable.specialDiet,
        usersTable.id,
        usersTable.email,
        personalInfoTable.name,
        personalInfoTable.surname,
        personalInfoTable.gender
      );

    const [enrollmentCount] = await db
      .select({ count: count() })
      .from(enrollmentsQuery.as('enrollments'))
      .limit(1);

    const enrollments = await enrollmentsQuery
      .orderBy(desc(enrollmentQueueTable.dateOfEnrollment))
      .limit(size)
      .offset((page - 1) * size);

    return createSuccessResult({
      elements: enrollments,
      count: enrollmentCount.count,
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
