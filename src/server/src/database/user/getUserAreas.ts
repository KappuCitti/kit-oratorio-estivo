import {
  areaOnlyPermissions,
  type Area,
  type Permission,
} from '@/models/permissions.model';
import { eq, or } from 'drizzle-orm';
import { db } from '..';
import { managesTable } from '../schema/manages';

/**
 * Le aree dell'applicazione in cui l'utente puo' entrare.
 *
 * L'area admin si apre con almeno un permesso che esiste solo li'.
 *
 * L'area utente si apre con almeno un permesso che esiste solo li', ma per chi
 * ha anche l'area admin non basta: il ruolo `admin` ha di serie tutti i
 * permessi del genitore, e basarsi solo su quelli farebbe comparire l'area
 * utente a ogni responsabile. Per un responsabile l'area utente esiste solo se
 * e' davvero anche genitore o ragazzo, cioe' se gestisce qualcuno o e'
 * gestito da qualcuno.
 */
export async function getUserAreas(
  userId: string,
  permissions: readonly Permission[]
): Promise<Area[]> {
  const has = (area: Area) =>
    areaOnlyPermissions(area).some((p) => permissions.includes(p));

  const admin = has('admin');
  let user = has('user');

  if (user && admin) {
    const legame = await db.query.manages.findFirst({
      where: or(
        eq(managesTable.mainId, userId),
        eq(managesTable.targetId, userId)
      ),
    });
    user = !!legame;
  }

  const areas: Area[] = [];
  if (admin) areas.push('admin');
  if (user) areas.push('user');
  return areas;
}
