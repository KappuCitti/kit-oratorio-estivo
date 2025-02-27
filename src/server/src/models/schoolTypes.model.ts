export const SCHOOL_TYPES = ['Primary', 'Secondary'] as const;
export type SchoolType = (typeof SCHOOL_TYPES)[number];
