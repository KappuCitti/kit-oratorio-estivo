import { db } from '..';

/**
 * Tutti i ruoli assegnabili.
 *
 * Serve al lato amministrativo: creare una persona o cambiarne il ruolo vuole
 * un `roleId`, e senza questo elenco il client dovrebbe indovinare gli
 * identificativi.
 */
export async function getRoleList() {
  return await db.query.roles.findMany();
}
