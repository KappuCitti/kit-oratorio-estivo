import type { Class } from '@/models/class.model';
import type { SchoolType } from '@/models/schoolTypes.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { teamTable } from '../schema/team';
import { and, count, eq, like, or, SQL, sql } from 'drizzle-orm';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { jsonArray } from '../utils/jsonArray';

export async function getEnrollmentList(
  page: number,
  size: number,
  year: number,
  weekId?: number,
  teamId?: number,
  query: string = '',
  schoolType?: SchoolType,
  className?: Class
) {
  try {
    const filters = [eq(enrollmentTable.year, year)];
    if (schoolType) filters.push(eq(enrollmentTable.schoolType, schoolType));
    if (className) filters.push(eq(enrollmentTable.className, className));
    if (weekId)
      filters.push(sql`${enrollmentWeeksTable.weekId} IN (${weekId})`);
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
        className: enrollmentTable.className,
        schoolType: enrollmentTable.schoolType,
        year: enrollmentTable.year,
        dataProcessingConsent: enrollmentTable.dataProcessingConsent,
        exitAuthorization: enrollmentTable.exitAuthorization,
        imageProcessingConsent: enrollmentTable.imageProcessingConsent,
        specialDiet: enrollmentTable.specialDiet,
        team: {
          id: sql<number>`${teamTable.id}`.as('teamId'),
          name: sql<string>`${teamTable.name}`.as('teamName'),
          color: teamTable.color,
        },
        section: enrollmentTable.section,
        weeks: jsonArray({
          isPaid: enrollmentWeeksTable.isPaid,
          weekId: enrollmentWeeksTable.weekId,
        }).as('weeks'),
        user: {
          id: sql<string>`${usersTable.id}`.as('userId'),
          email: usersTable.email,
          name: sql<string>`${personalInfoTable.name}`.as('userName'),
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
      .innerJoin(personalInfoTable, eq(usersTable.id, personalInfoTable.id))
      .leftJoin(teamTable, eq(enrollmentTable.teamId, teamTable.id))
      .where(and(...filters))
      .groupBy(
        enrollmentTable.id,
        enrollmentTable.className,
        enrollmentTable.schoolType,
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
