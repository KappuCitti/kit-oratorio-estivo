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
    shirt: createSelectSchema(shirtSizeTable).nullable(),
    team: createSelectSchema(teamTable).nullable(),
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
        showPayments: true,
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
    team: createSelectSchema(teamTable).nullable(),
    class: createSelectSchema(classTable).omit({ schoolId: true }),
    school: createSelectSchema(schoolTable).omit({ canChooseActivities: true }),
  });

export type BareEnrollment = z.infer<typeof bareEnrollmentSchema>;

/**
 * Dettaglio di una singola iscrizione: la stessa forma di un elemento della
 * lista, piu' i campi che servono solo in modifica e i genitori che gestiscono
 * il ragazzo. La rotta GET /enrollments/{id} dichiarava `z.null()` con un TODO,
 * quindi il contratto non diceva nulla di cosa restituisse.
 */
export const enrollmentDetailSchema = bareEnrollmentSchema.extend({
  year: z.number().int().positive(),
  parentNotes: z.string().nullable(),
  managerNotes: z.string().nullable(),
  shirt: createSelectSchema(shirtSizeTable)
    .pick({ id: true, sizeName: true })
    .nullable(),
  user: createSelectSchema(usersTable)
    .pick({ id: true })
    .extend(
      createSelectSchema(personalInfoTable).pick({
        name: true,
        surname: true,
        gender: true,
        birthDate: true,
        birthPlace: true,
      }).shape
    ),
  managers: z.array(
    createSelectSchema(usersTable)
      .pick({ id: true, email: true, phone: true })
      .extend(
        createSelectSchema(personalInfoTable).pick({
          name: true,
          surname: true,
          gender: true,
        }).shape
      )
  ),
});

export type EnrollmentDetail = z.infer<typeof enrollmentDetailSchema>;

/**
 * Una richiesta in coda, come la vede chi deve approvarla.
 *
 * Porta la sezione e le note del genitore, che servono a decidere, e il
 * consenso a portare il ragazzo fuori dalla struttura: in coda puo' essere
 * nulla, perche' chi non ha il permesso di darlo via software passa dal
 * modulo cartaceo, e un responsabile lo annota all'approvazione.
 */
export const bareQueueEnrollmentSchema = bareEnrollmentSchema
  .omit({
    team: true,
    exitAuthorization: true,
  })
  .extend({
    exitAuthorization: z.boolean().nullable(),
    parentNotes: z.string().nullable(),
    weeks: z.array(
      createSelectSchema(enrollmentWeeksTable).omit({
        enrollmentId: true,
        isPaid: true,
      })
    ),
  });
export type BareQueueEnrollment = z.infer<typeof bareQueueEnrollmentSchema>;
