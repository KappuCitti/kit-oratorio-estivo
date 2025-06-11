import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { canUserManageFromToken } from '../user/managed/canUserManage';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { and, eq, inArray } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { getWeeksYear } from '../week/getWeeksYear';
import { dateYear } from '../utils/year';
import { isValidSchool } from '../school/isValid';
import { isValidClass } from '../class/isValid';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { DatabaseError } from '@/errors/database';

export async function createEnrollment(
  token: string,
  userId: string,
  dataProcessingConsent: boolean,
  imageProcessingConsent: boolean,
  classId: number,
  weeks: number[],
  specialDiet: string | null = null,
  parentNotes: string | null = null,
  shirtId: number | null = null
) {
  dbLogger.debug('Can user manage from token: %s %s', token, userId);
  const canManage = await canUserManageFromToken(token, userId);
  if (!canManage)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_manage');

  dbLogger.debug('Checking valid weeks');
  const validWeeks = await checkValidWeeks(weeks);
  if (!validWeeks)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  dbLogger.debug('Checking if already enrolled');
  const alreadyExists = await db
    .select()
    .from(enrollmentTable)
    .where(
      and(
        eq(enrollmentTable.userId, userId),
        inArray(
          enrollmentTable.year,
          db
            .select({ year: dateYear(weekTable.startDate) })
            .from(weekTable)
            .where(inArray(weekTable.id, weeks))
        )
      )
    );
  if (alreadyExists.length > 0)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_already_enrolled');

  dbLogger.debug('Checking if class is valid');
  const validClass = await isValidClass(classId);
  if (!validClass)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'class_not_found');

  dbLogger.debug('Getting year');
  const year = await getWeeksYear(weeks);

  dbLogger.debug('Creating enrollment');
  await db.transaction(async (tx) => {
    const [enrollment] = await tx
      .insert(enrollmentQueueTable)
      .values({
        userId,
        year,
        dataProcessingConsent,
        imageProcessingConsent,
        exitAuthorization: false,
        classId,
        dateOfEnrollment: new Date(),
        specialDiet,
        shirtSizeId: shirtId,
        parentNotes,
      })
      .$returningId();
    const weeksToInsert = weeks.map((week) => ({
      enrollmentId: enrollment.id,
      weekId: week,
    }));
    dbLogger.debug('Inserting weeks');
    await tx.insert(enrollmentQueueWeeksTable).values(weeksToInsert);
    return enrollment.id;
  });
}
