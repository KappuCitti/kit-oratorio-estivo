import { HttpStatusCodes } from '@/codes';
import { createErrorResult } from '@/utils/createResult';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema/shirt';
import { DatabaseError } from '@/errors/database';

export async function editShirt(
  id: number,
  sizeName?: string,
  width?: string,
  height?: string,
  isAvailable?: boolean
) {
  const validId = !!(await db.query.shirts.findFirst({
    where: eq(shirtSizeTable.id, id),
  }));
  if (!validId)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'shirt_not_found');

  if (sizeName) {
    const alreadyExists = !!(await db.query.shirts.findFirst({
      where: eq(shirtSizeTable.sizeName, sizeName),
    }));
    if (alreadyExists)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'shirt_exists');
  }

  await db
    .update(shirtSizeTable)
    .set({
      sizeName,
      width,
      height,
      isAvailable,
    })
    .where(eq(shirtSizeTable.id, id));
}
