import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema/shirt';
import { DatabaseError } from '@/errors/database';

export async function createShirt(
  sizeName: string,
  width: string,
  height: string,
  isAvailable?: boolean
) {
  const exists = !!(await db.query.shirts.findFirst({
    where: eq(shirtSizeTable.sizeName, sizeName),
  }));
  if (exists) throw new DatabaseError(HttpStatusCodes.CONFLICT, 'shirt_exists');
  const [{ id }] = await db
    .insert(shirtSizeTable)
    .values({
      sizeName,
      width,
      height,
      isAvailable: isAvailable ?? true,
    })
    .$returningId();
  return id;
}
