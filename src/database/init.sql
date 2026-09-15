-- Bootstrap del database MySQL.
--
-- Questo file viene eseguito una sola volta dal container MySQL, al primo
-- avvio, tramite /docker-entrypoint-initdb.d. Crea soltanto il database vuoto.
--
-- LO SCHEMA NON STA QUI. Le tabelle sono definite in
--   src/server/src/database/schema/*.ts
-- e applicate tramite le migrazioni versionate in src/server/src/drizzle:
--
--   cd src/server && bun run db:migrate
--
-- Questo file conteneva la copia dello schema v1 (tabelle PascalCase come
-- `Child`, `Parent`, `Point`, `Trip`, `UserAction`) che l'applicazione non usa
-- piu' da quando esiste il branch v2, e apriva con `DROP DATABASE IF EXISTS`.
-- Era una trappola: chi lo eseguiva otteneva uno schema incompatibile con il
-- server, dopo aver cancellato quello buono. La versione storica resta
-- recuperabile con `git log -- src/database/init.sql`.

CREATE DATABASE IF NOT EXISTS `oratorio`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
