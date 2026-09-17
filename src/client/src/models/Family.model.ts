import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';
import Address from './Address.model';

export type gender = 'M' | 'F' | 'Other';

type ManagedResponse = InferResponseType<typeof api.users.$get, 200>;

/**
 * Una persona gestita da chi e' collegato (tipicamente un figlio), come la
 * restituisce GET /users.
 */
export type FamilyMember = Extract<
  ManagedResponse,
  { success: true }
>['data'][number];

/*
 * I tipi qui sotto NON descrivono risposte del server: sono le forme dei form
 * di `app-child` e `app-parent`, cioe' dati che l'utente sta ancora
 * compilando e che non sono stati inviati da nessuna parte.
 *
 * Tutto il resto di questo file e' stato rimosso perche' descriveva lo schema
 * v1 e rotte mai esistite: `PeopleSearch` (che per giunta dichiarava
 * `surname: gender`), `ChildSearch`, `ParentSearch`, `ChildResponse`,
 * `ParentResponse` e `Family`. Servivano alle pagine admin/people-*, tolte
 * perche' chiamavano /people, /childs e /parents.
 */

export interface Child {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  birthDate: string;
  birthPlace: string;
  address: Address;
}

export interface Parent {
  id: number;
  name: string;
  surname: string;
  gender: gender;
  email: string;
  phoneNumber: string;
}
