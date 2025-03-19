import type { Gender } from '@/models/gender.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { parentTable } from '../schema';

export async function editParent(
  id: number,
  name: string,
  surname: string,
  gender: Gender,
  email: string | null,
  phoneNumber: string
) {
  try {
    const exists = !!(await db.query.parentTable.findFirst({
      where: eq(parentTable.id, id),
    }));
    if (!exists) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    await db
      .update(parentTable)
      .set({
        name,
        surname,
        gender,
        email,
        phoneNumber,
      })
      .where(eq(parentTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
