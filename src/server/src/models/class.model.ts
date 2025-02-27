export const CLASSES = ['I', 'II', 'III', 'IV', 'V'] as const;
export type Class = (typeof CLASSES)[number];
