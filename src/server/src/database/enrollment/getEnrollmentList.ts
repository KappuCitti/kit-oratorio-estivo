import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '@/database';
import type { BareEnrollment } from '@/models/enrollment.model';
import { eq } from 'drizzle-orm';
import { childTable, enrollmentWeeksTable, teamTable } from '../schema';

export async function getEnrollmentList(page: number, size: number) {
  try {
    const eIds = await db.query.enrollmentTable.findMany({
      limit: size,
      offset: (page - 1) * size,
    });
    const enrollments: BareEnrollment[] = [];
    for (const enroll of eIds) {
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
        weeks: await db.query.enrollmentWeeksTable.findMany({
          where: eq(enrollmentWeeksTable.enrollmentId, enroll.id),
          columns: {
            enrollmentId: false,
          },
        }),
        team: enroll.teamId ? (await db.query.teamTable.findMany({
          where: eq(teamTable.id, enroll.teamId),
        }))[0] : null,
      });
    }
    return createSuccessResult(enrollments);
  } catch (e) {
    console.error(e);
    return createErrorResult(500);
  }
}
