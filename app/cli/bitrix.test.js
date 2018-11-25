#!/usr/bin/env node

let {
	currentDir,
	mochaPath,
	mochaBootstrapPath,
} = require('../constants');

const { exec } = require('shelljs');
const argv = require('minimist')(process.argv.slice(2));

const customDir = argv.p || argv.path;

if (typeof customDir === 'string') {
	currentDir = customDir;
}

exec(`${mochaPath} --recursive ${currentDir}/test -r ${mochaBootstrapPath} --reporter spec --colors`);