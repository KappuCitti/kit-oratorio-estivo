import { addressTable } from '@/database/schema/address';
import { classTable } from '@/database/schema/class';
import { enrollmentTable } from '@/database/schema/enrollment';
import { enrollmentWeeksTable } from '@/database/schema/enrollmentWeek';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { schoolTable } from '@/database/schema/school';
import { shirtSizeTable } from '@/database/schema/shirt';
import { teamTable } from '@/database/schema/team';
import { usersTable } from '@/database/schema/user';
import { weekTable } from '@/database/schema/week';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const enrollmentTableSchema = createSelectSchema(enrollmentTable);
export type EnrollmentTable = z.infer<typeof enrollmentTableSchema>;

export const fullEnrollmentSchema = enrollmentTableSchema
  .omit({
    userId: true,
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

export const bareEnrollmentSchema = createSelectSchema(enrollmentTable)
  .omit({
    userId: true,
    teamId: true,
    shirtSizeId: true,
    dateOfEnrollment: true,
    year: true,
    managerNotes: true,
    parentNotes: true,
    classId: true,
  })
  .extend({
    user: createSelectSchema(usersTable)
      .omit({
        password: true,
        theme: true,
        roleId: true,
        email: true,
        phone: true,
      })
      .and(
        createSelectSchema(personalInfoTable).omit({
          id: true,
          addressId: true,
          birthDate: true,
          birthPlace: true,
        })
      ),
    weeks: z.array(
      createSelectSchema(enrollmentWeeksTable).omit({
        enrollmentId: true,
      })
    ),
    team: z.union([createSelectSchema(teamTable), z.null()]),
    class: createSelectSchema(classTable).omit({ schoolId: true }),
    school: createSelectSchema(schoolTable).omit({ canChooseActivities: true }),
  });

export type BareEnrollment = z.infer<typeof bareEnrollmentSchema>;

export const bareQueueEnrollmentSchema = bareEnrollmentSchema
  .omit({
    team: true,
    section: true,
    exitAuthorization: true,
  })
  .extend({
    weeks: z.array(
      createSelectSchema(enrollmentWeeksTable).omit({
        enrollmentId: true,
        isPaid: true,
      })
    ),
  });
export type BareQueueEnrollment = z.infer<typeof bareQueueEnrollmentSchema>;
