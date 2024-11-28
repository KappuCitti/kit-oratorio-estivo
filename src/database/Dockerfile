FROM mysql:8.0
WORKDIR /db
COPY init.sql /docker-entrypoint-initdb.d
EXPOSE 3306