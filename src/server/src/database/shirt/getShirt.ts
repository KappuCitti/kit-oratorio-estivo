import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema/shirt';

export async function getShirt(id: number) {
  const shirt = await db.query.shirts.findFirst({
    where: eq(shirtSizeTable.id, id),
  });
  return shirt;
}
