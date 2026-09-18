import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq } from 'drizzle-orm';
import { db } from '../..';
import { usersTable } from '../../schema/user';
import { canUserManage } from './canUserManage';

/**
 * Decide se una persona gestita vede prezzi e pagamenti delle proprie
 * settimane. Puo' farlo solo chi la gestisce.
 */
export async function setShowPayments(
  managerId: string,
  targetId: string,
  showPayments: boolean
) {
  if (!(await canUserManage(managerId, targetId)))
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_manage');

  await db
    .update(usersTable)
    .set({ showPayments })
    .where(eq(usersTable.id, targetId));
}
