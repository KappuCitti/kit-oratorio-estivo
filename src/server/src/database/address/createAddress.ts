import type { BodyAddress } from '@/models/address.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { and, eq } from 'drizzle-orm';
import { addressTable } from '../schema/address';
import type { Transaction } from '@/models/common.model';

export async function createAddressIfNotExists(address: BodyAddress) {
  const existingAddress = await db.query.addresses.findFirst({
    columns: { id: true },
    where: and(
      eq(addressTable.city, address.city),
      eq(addressTable.street, address.street),
      eq(addressTable.postalCode, address.postalCode),
      eq(addressTable.country, address.country)
    ),
  });
  if (existingAddress) return existingAddress.id;
  const [{ id }] = await db.insert(addressTable).values(address).$returningId();
  return id;
}

export async function txCreateAddressIfNotExists(
  db: Transaction,
  address: BodyAddress
) {
  const existingAddress = await db.query.addresses.findFirst({
    columns: { id: true },
    where: and(
      eq(addressTable.city, address.city),
      eq(addressTable.street, address.street),
      eq(addressTable.postalCode, address.postalCode),
      eq(addressTable.country, address.country)
    ),
  });
  if (existingAddress) return existingAddress.id;
  const [{ id }] = await db.insert(addressTable).values(address).$returningId();
  return id;
}
