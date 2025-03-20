import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import {
  attendanceTable,
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  weekTable,
} from '../schema';
import {
  and,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  notInArray,
  sql,
} from 'drizzle-orm';

export async function getAttendances(date: Date, page: number, size: number) {
  try {
    const childWithAttendance = db
      .select({
        id: attendanceTable.id,
        childId: enrollmentTable.childId,
        childName: childTable.name,
        childSurname: childTable.surname,
        present: attendanceTable.present,
        eatsInOratory: attendanceTable.eatsInOratory,
        eatsPlain: attendanceTable.eatsPlain,
      })
      .from(attendanceTable)
      .innerJoin(
        enrollmentTable,
        eq(attendanceTable.enrollmentId, enrollmentTable.id)
      )
      .innerJoin(childTable, eq(enrollmentTable.childId, childTable.id))
      .where(eq(attendanceTable.date, date))
      .as('attendances');
    const childWithoutAttendance = db
      .select({
        id: sql<number>`NULL`,
        childId: childTable.id,
        childName: childTable.name,
        childSurname: childTable.surname,
        present: sql<boolean>`false`,
        eatsInOratory: sql<boolean>`false`,
        eatsPlain: sql<boolean>`false`,
      })
      .from(childTable)
      .innerJoin(enrollmentTable, eq(enrollmentTable.childId, childTable.id))
      .innerJoin(
        enrollmentWeeksTable,
        eq(enrollmentWeeksTable.enrollmentId, enrollmentTable.id)
      )
      .innerJoin(weekTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
      .where(
        and(
          notInArray(
            childTable.id,
            sql`${db
              .select({ id: childWithAttendance.id })
              .from(childWithAttendance)}`
          ),
          lte(weekTable.startDate, date),
          gte(weekTable.endDate, date)
        )
      );
    const attendances = await db
      .select()
      .from(childWithAttendance)
      .union(childWithoutAttendance)
      .orderBy(childTable.surname, childTable.name)
      .limit(size)
      .offset((page - 1) * size);

    return createSuccessResult(attendances);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
