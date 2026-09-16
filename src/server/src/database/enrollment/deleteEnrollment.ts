import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';

export async function deleteEnrollment(id: number) {
  const exists = !!(await db.query.enrollments.findFirst({
    where: eq(enrollmentTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'enrollment_not_found');

  // enrollment_weeks ha gia' ON DELETE CASCADE verso enrollments, ma la riga
  // esplicita tiene la transazione leggibile e non dipende dal fatto che i
  // vincoli siano attivi sul database di turno.
  await db.transaction(async (tx) => {
    await tx
      .delete(enrollmentWeeksTable)
      .where(eq(enrollmentWeeksTable.enrollmentId, id));
    await tx.delete(enrollmentTable).where(eq(enrollmentTable.id, id));
  });
}
