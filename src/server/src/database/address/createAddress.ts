import type { BodyAddress } from '@/models/address.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { addressTable } from '../schema';
import { and, eq } from 'drizzle-orm';

export async function createAddressIfNotExists(address: BodyAddress) {
  try {
    const existingAddress = await db.query.addressTable.findFirst({
      columns: { id: true },
      where: and(
        eq(addressTable.city, address.city),
        eq(addressTable.street, address.street),
        eq(addressTable.postalCode, address.postalCode),
        eq(addressTable.country, address.country)
      ),
    });
    if (existingAddress) return createSuccessResult(existingAddress.id);
    const [{ id }] = await db
      .insert(addressTable)
      .values(address)
      .$returningId();
    return createSuccessResult(id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
