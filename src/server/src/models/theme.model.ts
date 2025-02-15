export const THEMES = ['Dark', 'Light', 'System'] as const;

export type Theme = (typeof THEMES)[number];
