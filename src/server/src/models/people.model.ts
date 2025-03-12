import { z } from 'zod';
import { GENDERS } from './gender.model';

export const PEOPLE_TYPES = ['Child', 'Parent'] as const;
export type PeopleType = (typeof PEOPLE_TYPES)[number];

export const peopleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  surname: z.string(),
  gender: z.enum(GENDERS),
  type: z.enum(PEOPLE_TYPES),
});
export type People = z.infer<typeof peopleSchema>;
