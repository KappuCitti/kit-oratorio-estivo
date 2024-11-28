/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */

require('./utils/console-utils');

const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { readFileSync } = require('fs');

const Database = require('./database/_index');

const router = require('./router/_index');
const config = require('./config');

const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost',
      'http://localhost:4200',
      'https://localhost',
      'https://localhost:4200',
    ],
    allowedHeaders: [
      'X-ACCESS_TOKEN',
      'Access-Control-Allow-Origin',
      'Authorization',
      'Origin',
      'x-requested-with',
      'Content-Type',
      'Content-Range',
      'Content-Disposition',
      'Content-Description',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use('/static', express.static(path.resolve('./static')));
app.use('/static/music', express.static(path.resolve(config.MUSIC_FOLDER)))
app.use('/favicon.ico', express.static(path.resolve('./static/favicon.ico')))


// Swagger docs
const specs = swaggerJsdoc(JSON.parse(readFileSync('./swaggerOptions.json', 'utf8')));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);


app.use('/', router());

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));

(async () => {
  try {
    const database = new Database();
    await database.init();
    app.database = database;

    console.info('Database inizializzato correttamente.');
  } catch (err) {
    console.error('Errore:', err.message);
  }
})();

app.listen(config.PORT, config.HOST, () => {
  console.info('[Server] Server listening on port 3000');
});