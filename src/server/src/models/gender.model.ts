export const GENDERS = ['M', 'F', 'Other'] as const;
export type Gender = (typeof GENDERS)[number];
