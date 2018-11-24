#!/usr/bin/env node

let {
	currentDir,
	mochaPath,
	mochaBootstrapPath,
} = require('../constants');

const { exec } = require('shelljs');

const customDir = process.argv[2];

if (customDir) {
	currentDir = customDir;
}

exec(`${mochaPath} --recursive ${currentDir}/test -r ${mochaBootstrapPath} --reporter spec --colors`);