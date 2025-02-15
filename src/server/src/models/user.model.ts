import type { Theme } from './theme.model';

export interface UserTable {
  id: number;
  name: string;
  surname: string;
  email: string;
  theme: Theme;
}
