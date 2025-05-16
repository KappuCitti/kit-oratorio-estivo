import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { teamTable } from '../schema/team';
import { and, count, desc, eq, inArray, like, or, SQL } from 'drizzle-orm';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { jsonArray } from '../utils/jsonArray';
import { classTable } from '../schema/class';
import { schoolTable } from '../schema/school';
import { aliased } from '../utils/alias';

export async function getEnrollmentList(
  page: number,
  size: number,
  year: number,
  weekId?: number,
  teamId?: number,
  query: string = '',
  schoolId?: number,
  classId?: number
) {
  try {
    const filters = [eq(enrollmentTable.year, year)];
    if (schoolId) filters.push(eq(enrollmentTable.schoolId, schoolId));
    if (classId) filters.push(eq(enrollmentTable.classId, classId));
    if (weekId) filters.push(eq(enrollmentWeeksTable.weekId, weekId));
    if (teamId) filters.push(eq(enrollmentTable.teamId, teamId));
    if (query)
      filters.push(
        or(
          like(personalInfoTable.name, `%${query}%`),
          like(personalInfoTable.surname, `%${query}%`)
        ) as SQL
      );

    const enrollmentQuery = db
      .select({
        id: enrollmentTable.id,
        class: {
          id: aliased(classTable.id, 'classId'),
          name: aliased(classTable.name, 'className'),
        },
        school: {
          id: aliased(schoolTable.id, 'schoolId'),
          name: aliased(schoolTable.name, 'schoolName'),
        },
        year: enrollmentTable.year,
        dataProcessingConsent: enrollmentTable.dataProcessingConsent,
        exitAuthorization: enrollmentTable.exitAuthorization,
        imageProcessingConsent: enrollmentTable.imageProcessingConsent,
        specialDiet: enrollmentTable.specialDiet,
        team: {
          id: aliased(teamTable.id, 'teamId'),
          name: aliased(teamTable.name, 'teamName'),
          color: teamTable.color,
        },
        section: enrollmentTable.section,
        weeks: jsonArray({
          isPaid: enrollmentWeeksTable.isPaid,
          weekId: enrollmentWeeksTable.weekId,
        }).as('weeks'),
        user: {
          id: aliased(usersTable.id, 'userId'),
          name: aliased(personalInfoTable.name, 'userName'),
          surname: personalInfoTable.surname,
          sex: personalInfoTable.sex,
        },
      })
      .from(enrollmentTable)
      .leftJoin(
        enrollmentWeeksTable,
        eq(enrollmentTable.id, enrollmentWeeksTable.enrollmentId)
      )
      .innerJoin(usersTable, eq(enrollmentTable.userId, usersTable.id))
      .innerJoin(schoolTable, eq(enrollmentTable.schoolId, schoolTable.id))
      .innerJoin(classTable, eq(enrollmentTable.classId, classTable.id))
      .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
      .leftJoin(teamTable, eq(enrollmentTable.teamId, teamTable.id))
      .where(and(...filters))
      .groupBy(
        enrollmentTable.id,
        schoolTable.id,
        classTable.id,
        schoolTable.name,
        classTable.name,
        enrollmentTable.year,
        enrollmentTable.dataProcessingConsent,
        enrollmentTable.exitAuthorization,
        enrollmentTable.imageProcessingConsent,
        enrollmentTable.specialDiet,
        enrollmentTable.section,
        teamTable.id,
        teamTable.name,
        teamTable.color,
        usersTable.id,
        usersTable.email,
        personalInfoTable.name,
        personalInfoTable.surname,
        personalInfoTable.sex
      );

    const [enrollmentCount] = await db
      .select({ count: count() })
      .from(enrollmentQuery.as('enrollments'))
      .limit(1);

    const enrollments = await enrollmentQuery
      .orderBy(desc(enrollmentTable.dateOfEnrollment))
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
