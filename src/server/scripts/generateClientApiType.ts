/**
 * Genera per il client il contratto dell'API come singolo file di
 * dichiarazioni, a partire dai tipi veri delle rotte del server.
 *
 * Il client usa `hc<ApiType>` (RPC di Hono): percorsi, parametri, corpo della
 * richiesta e forma della risposta arrivano da qui, invece di essere riscritti
 * a mano nei modelli. Cambiare una rotta sul server e dimenticarsi del client
 * diventa un errore di compilazione.
 *
 * Il file viene COMMITTATO apposta: il Dockerfile del client copia solo
 * src/client, quindi la build del client non deve dipendere dal sorgente del
 * server. E' lo stesso motivo per cui e' committato permissions.generated.ts.
 *
 *   bun run sync:api-type           rigenera il file
 *   bun run sync:api-type --check   fallisce se il file e' disallineato
 */
import { resolve } from 'node:path';

const SERVER_ROOT = resolve(import.meta.dir, '..');
const ENTRY = 'src/api-type.ts';
const OUTPUT = resolve(
  SERVER_ROOT,
  '..',
  'client',
  'src',
  'models',
  'api.generated.d.ts'
);

const INTESTAZIONE = `/**
 * FILE GENERATO - non modificarlo a mano.
 *
 * Contratto dell'API del server, prodotto da
 * src/server/scripts/generateClientApiType.ts a partire dai tipi veri delle
 * rotte (src/server/src/router/v1).
 *
 * Per rigenerarlo:  cd src/server && bun run sync:api-type
 * Per verificarlo:  cd src/server && bun run sync:api-type -- --check
 *
 * Il controllo gira dentro \`bun run check\` del server, quindi una rotta
 * aggiunta o cambiata fa fallire la verifica finche' questo file non viene
 * rigenerato.
 */
`;

async function genera(): Promise<string> {
  const temporaneo = resolve(SERVER_ROOT, 'node_modules', '.api-type.d.ts');

  const processo = Bun.spawn(
    [
      'bunx',
      'dts-bundle-generator',
      '--project',
      'tsconfig.json',
      '--no-check',
      '--no-banner',
      '--export-referenced-types=false',
      '-o',
      temporaneo,
      ENTRY,
    ],
    { cwd: SERVER_ROOT, stdout: 'pipe', stderr: 'pipe' }
  );

  const codice = await processo.exited;
  if (codice !== 0) {
    console.error(await new Response(processo.stderr).text());
    console.error(await new Response(processo.stdout).text());
    throw new Error('dts-bundle-generator e uscito con codice ' + codice);
  }

  let contenuto = await Bun.file(temporaneo).text();

  // Il contratto porta con se' l'ambiente del server (`Bindings`), che contiene
  // il tipo del logger. Al client non serve - `hc` guarda solo lo schema delle
  // rotte - e lasciarlo lo obbligherebbe a dipendere da `hono-pino` e quindi da
  // pino. Viene quindi sostituito con `unknown`.
  contenuto = contenuto.replace(
    /^import \{ PinoLogger \} from 'hono-pino';\r?\n/m,
    '// Il tipo del logger del server non interessa al client: `hc` usa solo lo\n' +
      '// schema delle rotte. Sostituito per non trascinare le dipendenze di\n' +
      '// logging del server dentro quelle del client.\ntype PinoLogger = unknown;\n'
  );

  // Si controlla l'import, non la stringa: il commento qui sopra nomina il
  // pacchetto e farebbe scattare un controllo troppo generico.
  if (/^import .*from '[^']*pino[^']*';/m.test(contenuto)) {
    throw new Error(
      'la sostituzione del tipo del logger non ha funzionato: nel file generato resta un import di pino'
    );
  }

  return INTESTAZIONE + contenuto.trimStart() + '\n';
}

const contenuto = await genera();
const check = process.argv.includes('--check');

const attuale = (await Bun.file(OUTPUT).exists())
  ? await Bun.file(OUTPUT).text()
  : null;

const righe = contenuto.split('\n').length;

if (check) {
  if (attuale === contenuto) {
    console.log(`contratto API allineato: ${righe} righe`);
    process.exit(0);
  }
  console.error(
    'Il contratto API del client e disallineato rispetto al server.\n' +
      'Rigeneralo con:  cd src/server && bun run sync:api-type'
  );
  process.exit(1);
}

if (attuale === contenuto) {
  console.log('contratto API allineato, niente da riscrivere');
  process.exit(0);
}

await Bun.write(OUTPUT, contenuto);
console.log(
  `scritto src/client/src/models/api.generated.d.ts: ${righe} righe`
);
