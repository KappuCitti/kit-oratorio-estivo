import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * L'utente collegato, come lo restituisce GET /users/self.
 *
 * Non e' piu' scritto a mano: il tipo viene dedotto dal contratto generato dal
 * server (vedi models/api.generated.d.ts). La versione precedente dichiarava
 * `theme` come campo obbligatorio, mentre il server non lo restituiva affatto -
 * ed era per questo che il menu del tema nella pagina profilo restava sempre su
 * "System". Adesso o il campo c'e' in entrambi, o non compila.
 */
type SelfResponse = InferResponseType<typeof api.users.self.$get, 200>;

type Self = Extract<SelfResponse, { success: true }>['data'];

export default interface User extends Self {}

export type Role = Self['role'];
export type RolePermissions = Self['role'];

export interface UserSimplified {
  id: string;
  name: string;
  surname: string;
  gender: string;
}
