import type { Gender } from '@/models/gender.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { childTable } from '../schema';
import type { BodyAddress } from '@/models/address.model';
import { createAddressIfNotExists } from '../address/createAddress';

export async function editChildren(
  id: number,
  name?: string,
  surname?: string,
  gender?: Gender,
  birthPlace?: string,
  birthDate?: string,
  address?: BodyAddress
) {
  try {
    const exists = !!(await db.query.childTable.findFirst({
      where: eq(childTable.id, id),
    }));
    if (!exists) return createErrorResult(HttpStatusCodes.NOT_FOUND);

    const addressResult = address
      ? await createAddressIfNotExists(address)
      : undefined;
    if (addressResult && !addressResult.success)
      return createErrorResult(addressResult.error);

    const addressId = addressResult?.data;

    await db
      .update(childTable)
      .set({
        name,
        surname,
        gender,
        birthPlace,
        birthDate,
        addressId,
      })
      .where(eq(childTable.id, id));

    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
