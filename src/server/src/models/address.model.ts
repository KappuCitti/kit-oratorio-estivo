import { addressTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const addressSchema = createSelectSchema(addressTable);

export type Address = z.infer<typeof addressSchema>;

export const bodyAddressSchema = addressSchema.omit({
  id: true,
});
export type BodyAddress = z.infer<typeof bodyAddressSchema>;
