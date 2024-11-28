/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const ini = require('ini')
require('dotenv').config({ path: './config/.env' });

const fs = require('fs')

if (!fs.existsSync('./config/config.ini')) {
  console.error('config.ini not found')
  process.exit(1)
}

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'))

module.exports = {
  // Server configs
  PORT: config.server.port || 3000,
  HOST: config.server.host || '0.0.0.0',
  LOG_LEVEL: config.server.log_level || '4',

  // Static folder configs
  MUSIC_FOLDER: process.env.MUSIC_FOLDER || './static/music',

  // Database configs
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: process.env.MYSQL_PORT || '3306',
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'root',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'oratorio',
}