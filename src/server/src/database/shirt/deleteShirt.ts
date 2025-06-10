import { eq } from 'drizzle-orm';
import { db } from '..';
import { HttpStatusCodes } from '@/codes';
import { shirtSizeTable } from '../schema/shirt';
import { DatabaseError } from '@/errors/database';

export async function deleteShirt(id: number) {
  const [{ affectedRows }] = await db
    .delete(shirtSizeTable)
    .where(eq(shirtSizeTable.id, id));
  if (affectedRows <= 0)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'shirt_not_found');
}
