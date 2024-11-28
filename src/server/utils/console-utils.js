/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const colors = require('colors/safe');
const { mkdirSync, appendFileSync, existsSync } = require('fs');
const path = require('path');
const { LOG_LEVEL } = require('../config/index')

const { log, error, warn, info, debug } = console;

const LogLevel = {
  ERROR: 0,
  WARNING: 1,
  INFO: 2,
  LOG: 3,
  DEBUG: 4,
};

const logFolder = path.join(__dirname, '../logs/');
function getLogFile() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const filePath = `${logFolder}${year}-${month}-${day}.log`;
  if (!existsSync(filePath)) {
    mkdirSync(path.dirname(filePath), { recursive: true });
    appendFileSync(filePath, '');
  }
  return filePath;
}

function writeFile(level, args) {
  const filePath = getLogFile();
  appendFileSync(
    filePath,
    `${new Date().toLocaleTimeString()} | ${Object.keys(LogLevel).find((key) => LogLevel[key] == level)} | ${args.join(
      ' '
    )}`
  );
  appendFileSync(filePath, '\n');
}

const newLog = (args) => {
  const now = new Date();

  // @ts-ignore
  log(`[${now.toLocaleTimeString()} ${now.toLocaleDateString()}] [${colors.blue('*')}]`, ...args);
  writeFile(LogLevel.LOG, args);
};

const newInfo = (args) => {
  const now = new Date();

  // @ts-ignore
  info(`[${now.toLocaleTimeString()} ${now.toLocaleDateString()}] [${colors.cyan('*')}]`, ...args);
  writeFile(LogLevel.INFO, args);
};

const newWarn = (args) => {
  const now = new Date();

  // @ts-ignore
  warn(`[${now.toLocaleTimeString()} ${now.toLocaleDateString()}] [${colors.yellow('!')}]`, ...args);
  writeFile(LogLevel.WARNING, args);
};

const newError = (args) => {
  const now = new Date();

  // @ts-ignore
  error(`[${now.toLocaleTimeString()} ${now.toLocaleDateString()}] [${colors.red('!')}]`, ...args);
  writeFile(LogLevel.ERROR, args);
};

const newDebug = (args) => {
  const now = new Date();

  // @ts-ignore
  debug(`[${now.toLocaleTimeString()} ${now.toLocaleDateString()}] [${colors.magenta('*')}]`, ...args);
  writeFile(LogLevel.DEBUG, args);
};

module.exports = (() => {
  console.log = (...args) => {
    if (LogLevel.LOG > LOG_LEVEL) return;
    newLog(args);
  };

  console.info = (...args) => {
    if (LogLevel.INFO > LOG_LEVEL) return;
    newInfo(args);
  };

  console.warn = (...args) => {
    if (LogLevel.WARNING > LOG_LEVEL) return;
    newWarn(args);
  };

  console.error = (...args) => {
    if (LogLevel.ERROR > LOG_LEVEL) return;
    newError(args);
  };

  console.debug = (...args) => {
    if (LogLevel.DEBUG > LOG_LEVEL) return;
    newDebug(args);
  };

  // console.log(`LOG`)
  // console.info(`INFO`)
  // console.warn(`WARN`)
  // console.error(`ERROR`)
  // console.debug(`DEBUG`)

  console.debug(`[Console] Console class succesfully injected with level "${LOG_LEVEL}" (${Object.keys(LogLevel).find((key) => LogLevel[key] == LOG_LEVEL)}) as log level!`);
})();