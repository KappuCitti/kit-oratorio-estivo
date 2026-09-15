# Server Hono su Bun.
#
# Si esegue il TypeScript direttamente: Bun lo supporta nativamente e non c'e'
# nessun vantaggio a precompilare.
#
# VERIFICATO: non si puo' spedire solo `dist/`. `tsc` non riscrive gli alias di
# path, quindi 150 dei 224 file in dist/ contengono ancora `import ... from '@/...'`.
# Funzionano solo perche' Bun risolve quegli alias tramite tsconfig.json
# tornando a `src/`. Un'immagine con il solo dist/ fallirebbe all'avvio.

FROM oven/bun:1-slim AS deps
WORKDIR /app
# Solo i file di dipendenze: il layer di install si riusa finche' non cambiano.
COPY package.json bun.lock ./
# Niente --production: drizzle-kit e' una devDependency, ma serve per applicare
# le migrazioni dal container (`docker compose run --rm server bun run db:migrate`).
# Senza, l'unico modo per migrare sarebbe lo script .cmd, che gira solo su Windows.
RUN bun install --frozen-lockfile


FROM oven/bun:1-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
# drizzle.config.ts serve a `drizzle-kit migrate`, scripts/ a `db:setup:data`:
# senza, il database si puo' inizializzare solo da fuori il container.
COPY package.json bun.lock tsconfig.json drizzle.config.ts ./
COPY src ./src
COPY scripts ./scripts

# Il server serve /static/* da path.join(__dirname, '../../global/'), che da
# /app/src/utils risolve a /app/global. Senza questa directory il mount dei file
# statici punta al nulla.
RUN mkdir -p /app/global /app/logs

# L'immagine base crea gia' l'utente non privilegiato `bun`.
RUN chown -R bun:bun /app
USER bun

EXPOSE 3000

# L'healthcheck usa Bun invece di wget o curl: l'immagine slim e' Debian e non
# include nessuno dei due, mentre Bun c'e' per definizione.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/api/v1').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# `bun .` usa il campo "module" di package.json, cioe' src/index.ts.
CMD ["bun", "."]
