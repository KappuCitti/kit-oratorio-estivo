import { db } from '..';

export async function getShirtList() {
  const shirts = await db.query.shirts.findMany();
  return shirts;
}
