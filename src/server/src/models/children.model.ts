import { childTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { bodyAddressSchema } from './address.model';
import { parentSchema } from './parent.model';
import { fullEnrollmentSchema } from './enrollment.model';

export const childTableSchema = createSelectSchema(childTable);
export type ChildTable = z.infer<typeof childTableSchema>;

export const childSchema = childTableSchema.omit({
  addressId: true,
  birthPlace: true,
});
export type BareChild = z.infer<typeof childSchema>;

export const bodyChildSchema = childTableSchema
  .omit({
    id: true,
    addressId: true,
  })
  .extend({
    address: bodyAddressSchema,
  });
export type BodyChild = z.infer<typeof bodyChildSchema>;

export const fullChildSchema = createSelectSchema(childTable)
  .omit({
    addressId: true,
  })
  .extend({
    address: bodyAddressSchema,
    enrollments: z.array(fullEnrollmentSchema),
  });
export type FullChild = z.infer<typeof fullChildSchema>;

export const fullChildWithParentsSchema = fullChildSchema.extend({
  parents: z.array(parentSchema),
});
export type FullChildWithParents = z.infer<typeof fullChildWithParentsSchema>;
