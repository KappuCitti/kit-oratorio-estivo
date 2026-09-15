# Client Angular: build con Node, servito da nginx.
#
# Perche' Node e non Bun: la CLI di Angular gira su Node. Bun serve solo a
# installare le dipendenze, perche' il lockfile del progetto e' bun.lock e non
# package-lock.json (usare `npm install` risolverebbe versioni diverse da quelle
# bloccate nel lockfile, rendendo il build non riproducibile).

FROM node:24-alpine AS build
WORKDIR /app

# Bun e' distribuito anche su npm: cosi' l'immagine ha Node per Angular e Bun
# per l'install, senza script di installazione esterni.
RUN npm install -g bun@1

# Prima solo i file di dipendenze: se non cambiano, Docker riusa il layer
# di install anche quando cambia il codice.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
# La CLI va invocata via Node, non via lo shim `ng`.
RUN node node_modules/@angular/cli/bin/ng.js build --configuration production


FROM nginx:1.29-alpine AS runtime

# VERIFICATO sul build reale: l'application builder di Angular emette in
# dist/client/browser/, NON in dist/client/. Il Dockerfile della v1 copiava
# dist/client e nginx si sarebbe trovato una directory senza index.html.
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
COPY default.nginx /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
