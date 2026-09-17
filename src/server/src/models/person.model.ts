import { addressTable } from '@/database/schema/address';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { roleTable } from '@/database/schema/role';
import { usersTable } from '@/database/schema/user';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { idSchema, phoneSchema } from './common.model';

/** Una persona come compare nell'elenco della rubrica. */
export const personListItemSchema = createSelectSchema(usersTable)
  .pick({ id: true, email: true, phone: true })
  .extend({
    ...createSelectSchema(personalInfoTable).pick({
      name: true,
      surname: true,
      gender: true,
      birthDate: true,
    }).shape,
    role: createSelectSchema(roleTable),
  });

const personBaseSchema = createSelectSchema(usersTable)
  .pick({ id: true, email: true, phone: true })
  .extend({
    ...createSelectSchema(personalInfoTable).pick({
      name: true,
      surname: true,
      gender: true,
      birthDate: true,
      birthPlace: true,
    }).shape,
    role: createSelectSchema(roleTable),
  });

/**
 * Dettaglio di una persona, con le relazioni nei due versi: `managers` chi puo'
 * gestirla, `managed` chi gestisce lei.
 */
export const personDetailSchema = personBaseSchema.extend({
  address: createSelectSchema(addressTable).omit({ id: true }).nullable(),
  managers: z.array(personBaseSchema),
  managed: z.array(personBaseSchema),
});

const addressBodySchema = z.object({
  street: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  country: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(255),
});

/** Campi modificabili di una persona: tutti opzionali, si aggiorna cio' che arriva. */
export const updatePersonSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  surname: z.string().min(1).max(255).optional(),
  gender: z.enum(['M', 'F']).optional(),
  birthDate: z.string().date().nullable().optional(),
  birthPlace: z.string().min(1).max(255).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: phoneSchema.nullable().optional(),
  roleId: idSchema.optional(),
  address: addressBodySchema.nullable().optional(),
});

/** Una persona da creare dentro un nucleo familiare. */
export const familyPersonSchema = z.object({
  cf: z.string().length(16),
  password: z.string().min(8).max(255),
  name: z.string().min(1).max(255),
  surname: z.string().min(1).max(255),
  gender: z.enum(['M', 'F']),
  roleId: idSchema,
  email: z.string().email().nullable().optional(),
  phone: phoneSchema.nullable().optional(),
  birthDate: z.string().date().nullable().optional(),
  birthPlace: z.string().min(1).max(255).nullable().optional(),
  address: addressBodySchema.nullable().optional(),
});

export const createFamilySchema = z.object({
  managers: z.array(familyPersonSchema),
  managed: z.array(familyPersonSchema).min(1),
});
