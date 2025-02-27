import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '@/database';
import type { BareEnrollment } from '@/models/enrollment.model';
import { and, count, eq, getTableColumns, like, or } from 'drizzle-orm';
import {
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  teamTable,
} from '../schema';
import { HttpStatusCodes } from '@/codes';
import type { SchoolType } from '@/models/schoolTypes.model';
import type { Class } from '@/models/class.model';

export async function getEnrollmentList(
  page: number,
  size: number,
  year: number,
  weekId?: number,
  teamId?: number,
  query?: string,
  schoolType?: SchoolType,
  className?: Class
) {
  try {
    const filters: any[] = [];
    if (teamId) filters.push(eq(enrollmentTable.teamId, teamId));
    if (query) {
      query
        .split(' ')
        .filter((s) => s.trim().length > 0)
        .forEach((s) => {
          filters.push(
            or(
              like(childTable.name, `%${s}%`),
              like(childTable.surname, `%${s}%`)
            )
          );
        });
    }
    if (schoolType) filters.push(eq(enrollmentTable.schoolType, schoolType));
    if (className) filters.push(eq(enrollmentTable.class, className));
    const [rows] = await db
      .select({
        count: count(),
      })
      .from(enrollmentTable)
      .innerJoin(childTable, eq(enrollmentTable.childId, childTable.id))
      .where(and(eq(enrollmentTable.year, year), ...filters))
      .limit(size)
      .offset((page - 1) * size);

    const eIds = await db
      .select({
        ...getTableColumns(enrollmentTable),
      })
      .from(enrollmentTable)
      .innerJoin(childTable, eq(enrollmentTable.childId, childTable.id))
      .where(and(eq(enrollmentTable.year, year), ...filters))
      .limit(size)
      .offset((page - 1) * size);
    const enrollments: BareEnrollment[] = [];
    for (const enroll of eIds) {
      const weeks = await db.query.enrollmentWeeksTable.findMany({
        where: eq(enrollmentWeeksTable.enrollmentId, enroll.id),
        columns: {
          enrollmentId: false,
        },
      });
      if (weekId && !weeks.map((w) => w.weekId).includes(weekId)) continue;

      enrollments.push({
        id: enroll.id,
        class: enroll.class,
        section: enroll.section,
        dataProcessingConsent: enroll.dataProcessingConsent,
        exitAuthorization: enroll.exitAuthorization,
        schoolType: enroll.schoolType,
        child: (
          await db.query.childTable.findMany({
            where: eq(childTable.id, enroll.childId),
            columns: {
              addressId: false,
              birthDate: false,
              birthPlace: false,
            },
          })
        )[0],
        weeks,
        team: enroll.teamId
          ? (
              await db.query.teamTable.findMany({
                where: eq(teamTable.id, enroll.teamId),
              })
            )[0]
          : null,
      });
    }
    return createSuccessResult({ enrollments, count: rows?.count ?? 0 });
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
