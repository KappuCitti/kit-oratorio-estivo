import { childTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const childSchema = createSelectSchema(childTable).omit({
  addressId: true,
  birthPlace: true,
});

export type BareChild = z.infer<typeof childSchema>;
