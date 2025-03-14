import {
  addressTable,
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  parentTable,
  shirtSizeTable,
  teamTable,
  weekTable,
} from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const fullEnrollmentSchema = createSelectSchema(enrollmentTable)
  .omit({
    childId: true,
    teamId: true,
    shirtSizeId: true,
  })
  .extend({
    shirt: z.union([createSelectSchema(shirtSizeTable), z.null()]),
    team: z.union([createSelectSchema(teamTable), z.null()]),
    weeks: z.array(
      createSelectSchema(weekTable).extend({
        isPaid: z.boolean(),
      })
    ),
  });

export type FullEnrollment = z.infer<typeof fullEnrollmentSchema>;

export const fullEnrollmentWithFamilySchema = fullEnrollmentSchema.extend({
  family: z.object({
    child: createSelectSchema(childTable)
      .omit({ addressId: true })
      .extend({
        address: createSelectSchema(addressTable).omit({ id: true }),
      }),
    parents: z.array(createSelectSchema(parentTable)).max(2),
  }),
});

export type FullEnrollmentWithFamily = z.infer<
  typeof fullEnrollmentWithFamilySchema
>;

export const bareEnrollmentSchema = createSelectSchema(enrollmentTable)
  .omit({
    childId: true,
    teamId: true,
    shirtSizeId: true,
    dateOfEnrollment: true,
    year: true,
    managerNotes: true,
    parentNotes: true,
  })
  .extend({
    child: createSelectSchema(childTable).omit({
      addressId: true,
      birthDate: true,
      birthPlace: true,
    }),
    weeks: z.array(
      createSelectSchema(enrollmentWeeksTable).omit({
        enrollmentId: true,
      })
    ),
    team: z.union([createSelectSchema(teamTable), z.null()]),
  });

export type BareEnrollment = z.infer<typeof bareEnrollmentSchema>;
