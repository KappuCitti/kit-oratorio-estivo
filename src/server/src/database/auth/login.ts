import { db } from '@/database';
import { eq, or } from 'drizzle-orm';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { usersTable } from '../schema/user';
import { sessionTable } from '../schema/session';
import { DatabaseError } from '@/errors/database';
import { SESSION_DURATION_SECONDS } from '@/utils/cookies';
import { hashPassword } from '@/utils/password';

/**
 * Hash di una password casuale, calcolato una sola volta e riusato per far
 * costare un login con utente inesistente quanto uno con password sbagliata.
 */
let decoyHash: string | undefined;
async function getDecoyHash() {
  decoyHash ??= await hashPassword(crypto.randomUUID());
  return decoyHash;
}

export async function login(username: string, password: string) {
  dbLogger.debug('Searching user');
  const [user] = await db
    .select({
      id: usersTable.id,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(or(eq(usersTable.email, username), eq(usersTable.id, username)));
  dbLogger.debug('User found: %s', Boolean(user));

  // Verifica sempre una password, anche quando l'utente non esiste: altrimenti
  // il ramo "utente inesistente" torna subito mentre quello "password errata"
  // paga l'argon2, e il tempo di risposta diventa un oracolo sull'esistenza di
  // un codice fiscale (che e' un dato semi-pubblico).
  const isSame = await Bun.password.verify(
    password,
    user ? user.password : await getDecoyHash()
  );
  dbLogger.debug('Password checked: %s', isSame);

  // Messaggio unico: distinguere "utente inesistente" da "password errata"
  // permetteva di enumerare gli utenti registrati.
  if (!user || !isSame)
    throw new DatabaseError(
      HttpStatusCodes.UNAUTHORIZED,
      'invalid_credentials'
    );

  dbLogger.debug('Creating session');
  const [session] = await db
    .insert(sessionTable)
    .values({
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000),
      userId: user.id,
    })
    .$returningId();
  dbLogger.debug('Session created');
  return session.token;
}
