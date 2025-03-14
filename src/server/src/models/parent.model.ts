import { childTable, parentTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { addressSchema } from './address.model';

export const parentSchema = createSelectSchema(parentTable).omit({
  email: true,
  phoneNumber: true,
});
export type Parent = z.infer<typeof parentSchema>;

export const fullParentSchema = createSelectSchema(parentTable);
export type FullParent = z.infer<typeof fullParentSchema>;

export const fullParentWithChildrenSchema = fullParentSchema.extend({
  childrens: z.array(
    //? Pasted from child.model to avoid circular dependency
    createSelectSchema(childTable)
      .omit({
        addressId: true,
      })
      .extend({
        address: addressSchema,
      })
  ),
});
export type FullParentWithChildren = z.infer<
  typeof fullParentWithChildrenSchema
>;
