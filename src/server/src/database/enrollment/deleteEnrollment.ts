import { eq } from 'drizzle-orm';
import { db } from '..';
import { enrollmentTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';

export async function deleteEnrollment(id: number) {
  try {
    const enrollment = await db.query.enrollmentTable.findFirst({
      where: eq(enrollmentTable.id, id),
    });
    if (!enrollment) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    await db.delete(enrollmentTable).where(eq(enrollmentTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
