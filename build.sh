#!/usr/bin/env bash
#
# Avvia l'intero stack.
#
# Le variabili sostituite in docker-compose.yml (${MYSQL_*}, ${MUSIC_FOLDER})
# vengono lette dai file indicati con --env-file. Il percorso del .env del
# server e' cambiato passando alla v2: era ./src/server/config/.env.
set -euo pipefail

cd "$(dirname "$0")"

for f in ./src/server/src/config/.env ./src/database/.env; do
  if [ ! -f "$f" ]; then
    echo "Manca $f - copialo dal .env.example corrispondente e compilalo." >&2
    exit 1
  fi
done

# `docker-compose` (con trattino) e' la v1, non piu' mantenuta: si usa il
# sottocomando `docker compose`.
docker compose \
  --env-file ./src/server/src/config/.env \
  --env-file ./src/database/.env \
  up -d --build

echo
echo "Stack avviato. Il database e' vuoto al primo avvio: applica lo schema con"
echo "  docker compose run --rm server bun run db:migrate"
echo "  docker compose run --rm server bun run db:setup:data"
