import Address from './Address.model';
import { FamilyMember } from './Family.model';
import type { Permission } from './permissions.generated';
import { Theme } from './Theme.model';

export default interface User extends FamilyMember {
  // id: number;
  // email: string | null;
  // name: string;
  // surname: string;
  // phone: string | null;
  role: RolePermissions;
  // permissions: string[];
  // gender: gender;
  // birthDate: string | null;
  // birthPlace: string | null;
  address: Address;
  theme: Theme;
}

export interface UserSimplified {
  id: string;
  name: string;
  surname: string;
  gender: string;
}

export interface Role {
  id: number;
  name: string;
  displayName: string;
}

export interface RolePermissions extends Role {
  // Tipizzati con l'unione generata dal server: confrontare un permesso che
  // non esiste piu' diventa un errore di compilazione invece di una condizione
  // sempre falsa che nessuno nota.
  permissions: Permission[];
}

// export interface Permission {
//   id: number;
//   name: string;
// }
