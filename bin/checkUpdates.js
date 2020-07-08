#!/usr/bin/env node

/**
 *  bin/checkUpdates.js
 */

/*************
 * * IMPORTS *
 *************/

const childProcess = require("child_process")
const os = require("os")

const { lookpath } = require('lookpath');

const chalk = require('chalk');

/***************
 * * CONSTANTS *
 ***************/

const log = console.log;

// Text Styles
const info = chalk.bgGreen.black;
const err = chalk.bgRed.black;

/***************
 * * FUNCTIONS *
 ***************/

// Node Check Updates command
let ncuCmd = 'ncu --packageFile package.json & echo.';

// Updates command
let updatesCmd = 'updates & echo.';

// Check if packages are installed globally else use npx
(async () => {
  // node-check-updates package
  if (! await lookpath('ncu')) {
    ncuCmd = 'npx ' + ncuCmd
  }
  // updates package
  if (! await lookpath('updates')) {
    updatesCmd = 'npx ' + updatesCmd
  }
})()

/**
 * Check for outdated node modules
 */

log(info("\n Checking for Outdated Node Modules \n"));

[
  // TODO: Check yarn.lock exists else run `npm outdated`
  { command: "yarn outdated & echo." },

  { command: ncuCmd },

  { command: updatesCmd }
]
  .filter(({ onlyPlatforms }) => !onlyPlatforms || onlyPlatforms.includes(os.platform()))
  .forEach(commandAndOptions => {
    const { command, onlyPlatform: _, ...options } = commandAndOptions
    try {
      childProcess.execSync(command, {
        stdio: "inherit",
        ...options,
      })
    } catch (error) {
      log(err(" ERROR ") + error)
      // process.exit(error.status)
    }
  })

log(info(" DONE \n"))

/* EOF */
